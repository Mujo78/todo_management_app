using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Data;
using server.Models;

namespace server.IntegrationTests
{
    [Collection("Integration Tests")]
    public class TestBase(ServerWebApplicationFactory factory) : IAsyncLifetime
    {
        private readonly ServerWebApplicationFactory _factory = factory;
        private AsyncServiceScope _scope;
        protected IServiceProvider _services;
        protected HttpClient _client;

        public async Task InitializeAsync()
        {
            _client = _factory.CreateClient(new WebApplicationFactoryClientOptions());
            _scope = _factory.Services.CreateAsyncScope();
            _services = _scope.ServiceProvider;

            ClearDatabaseAsync();
            await EnsureDatabaseCreatedAsync();
            await SeedDataAsync();
        }

        private async Task EnsureDatabaseCreatedAsync()
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                await dbContext.Database.MigrateAsync();
            }
        }

        private void ClearDatabaseAsync()
        {
            var context = _services.GetRequiredService<ApplicationDBContext>();
            context.Database.EnsureDeleted();
        }

        private async Task SeedDataAsync()
        {
            var context = _services.GetRequiredService<ApplicationDBContext>();

            SeedDatabase(context);
            await context.SaveChangesAsync();
        }

        public async Task DisposeAsync()
        {
            await _scope.DisposeAsync();
        }

        private void SeedDatabase(ApplicationDBContext dbContext)
        {
            if (dbContext.Database.CanConnect() && !dbContext.Users.Any())
            {
                Guid userSecondId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
                Guid refreshTokenJTI = Guid.Parse("18b62733-3733-405d-9a83-bd5efa55435d");
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
                    Id = userSecondId,
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

                var verifyToken = new UserToken
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddHours(2),
                    Token = "s1mple-t0k3n-f0r-v3r1fy-3m61l",
                    TokenType = Utils.Enums.TokenType.EmailVerification,
                    UserId = user.Id
                };

                var invalidVerifyToken = new UserToken
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.Now,
                    ExpiresAt = DateTime.Now.AddHours(-2),
                    Token = "1nval1d-s1mple-t0k3n-f0r-v3r1fy-3m61l",
                    TokenType = Utils.Enums.TokenType.EmailVerification,
                    UserId = user.Id
                };

                var validRefreshToken = new RefreshToken
                {
                    Id = Guid.NewGuid(),
                    IsValid = true,
                    JwtTokenId = refreshTokenJTI.ToString(),
                    Refresh_Token = "s1mpl3-r3fr36h-t0k3n",
                    UserId = userSecond.Id,
                    ExpiresAt = DateTime.Now.AddDays(7),
                };

                dbContext.Users.AddRange([user, userSecond]);
                dbContext.UserTokens.AddRange([resetToken, invalidResetToken, verifyToken, invalidVerifyToken]);
                dbContext.RefreshTokens.Add(validRefreshToken);
            }
        }
    }
}
