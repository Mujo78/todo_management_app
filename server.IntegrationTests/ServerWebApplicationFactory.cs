using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using server.Data;

namespace server.IntegrationTests
{
    internal class ServerWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<ApplicationDBContext>));

                var connString = GetConnectionString();
                services.AddSqlServer<ApplicationDBContext>(connString);

                var dbContext = CreateContext(services);
                dbContext.Database.EnsureCreated();
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
            return dbContext;
        }
    }
}
