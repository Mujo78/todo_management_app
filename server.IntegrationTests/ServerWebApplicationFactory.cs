using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using server.Data;
using server.Models;

namespace server.IntegrationTests
{
    internal class ServerWebApplicationFactory : WebApplicationFactory<Program>
    {
        private readonly bool _seedDatabase;
        public ServerWebApplicationFactory(bool seedDB)
        {
            _seedDatabase = seedDB;
        }
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<ApplicationDBContext>));
                var connString = GetConnectionString();
                services.AddSqlServer<ApplicationDBContext>(connString);

                var dbContext = CreateContext(services);
                if (_seedDatabase)
                {
                    SeedDatabase(dbContext);
                }
            });
        }

        private static string? GetConnectionString()
        {
            var config = new ConfigurationBuilder().AddUserSecrets<ServerWebApplicationFactory>().Build();
            var connString = config.GetConnectionString("StageSQLConnection");
            return connString;
        }

        private static ApplicationDBContext CreateContext(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
            return dbContext;
        }

        private void SeedDatabase(ApplicationDBContext dbContext)
        {
            if (dbContext.Database.CanConnect() && !dbContext.Users.Any())
            {
                var user = new User
                {
                    Email = "user123@gmail.com",
                    Name = "User Test Integration Name",
                    Password = BCrypt.Net.BCrypt.HashPassword("Password&123456", 12),
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true,
                    Id = Guid.NewGuid(),
                };

                var userSecond = new User
                {
                    Email = "user12345@gmail.com",
                    Name = "User Test Integration Name",
                    Password = BCrypt.Net.BCrypt.HashPassword("Password&123456", 12),
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true,
                    Id = Guid.NewGuid(),
                };

                var resetToken = new UserToken
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddHours(2),
                    Token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd",
                    TokenType = Utils.Enums.TokenType.PasswordReset,
                    UserId = user.Id
                };

                var invalidResetToken = new UserToken
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddHours(-2),
                    Token = "1nval1d-s1mple-t0k3n-f0r-r3s3t-pa6w0rd",
                    TokenType = Utils.Enums.TokenType.PasswordReset,
                    UserId = user.Id
                };

                dbContext.Users.AddRange([user, userSecond]);
                dbContext.UserTokens.AddRange([resetToken, invalidResetToken]);
                dbContext.SaveChanges();
            }
        }
    }
}
