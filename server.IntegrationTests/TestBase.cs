using FluentAssertions.Common;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.IntegrationTests
{
    [Collection("Integration Tests")]
    public class TestBase(ServerWebApplicationFactory factory) : IAsyncLifetime
    {
        private readonly ServerWebApplicationFactory _factory = factory;
        public static IConfiguration _configuration;
        private AsyncServiceScope _scope;
        protected IServiceProvider _services;
        protected HttpClient _client;
        protected HttpClient _authorizedClient;

        public async Task InitializeAsync()
        {
            var builder = new ConfigurationBuilder().AddUserSecrets<TestBase>();
            _configuration = builder.Build();
            _client = _factory.CreateClient(new WebApplicationFactoryClientOptions());
            _authorizedClient = CreateClientWithAuth();
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

        private HttpClient CreateClientWithAuth()
        {
            var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
            });
            string accessToken = GenerateAccessTokenForTesting(DateTime.Now.AddHours(2));
            string refreshToken = "s1mpl3-r3fr36h-t0k3n";

            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            client.DefaultRequestHeaders.Add("Cookie", $"refreshToken={refreshToken}");
            return client;
        }

        public static string GenerateAccessTokenForTesting(DateTime expiresAt)
        {
            var secretKey = _configuration.GetValue<string>("ApiSettings:Secret");
            Guid userOneId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            Guid refreshTokenJTI = Guid.Parse("18b62733-3733-405d-9a83-bd5efa55435d");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey ?? "");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(JwtRegisteredClaimNames.Jti, refreshTokenJTI.ToString()),
                    new("userId", userOneId.ToString()),
                    new(JwtRegisteredClaimNames.Email, "user12345@gmail.com"),
                    new(JwtRegisteredClaimNames.Name, "User Test Integration Name"),
                }),
                Expires = expiresAt,
                Issuer = _configuration.GetValue<string>("ApiSettings:Issuer")!,
                Audience = _configuration.GetValue<string>("ApiSettings:Audience")!,
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string accessToken = tokenHandler.WriteToken(token);
            return accessToken;
        }

        private void SeedDatabase(ApplicationDBContext dbContext)
        {
            if (dbContext.Database.CanConnect() && !dbContext.Users.Any())
            {
                Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
                Guid assignmentSecondId = Guid.Parse("c17541b0-a5b7-4004-9e85-15c60d2a9b62");
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

                var assignment = new Assignment
                {
                    Id = assignmentId,
                    CreatedAt = DateTime.Now,
                    Description = "",
                    DueDate = DateTime.Now.AddDays(3),
                    Priority = Utils.Enums.Priority.Medium,
                    Status = Utils.Enums.Status.Open,
                    Title = "Test Assignment One",
                    UpdatedAt = DateTime.Now,
                    UserId = userSecondId
                };

                var assignmentSecond = new Assignment
                {
                    Id = assignmentSecondId,
                    CreatedAt = DateTime.Now,
                    Description = "",
                    DueDate = DateTime.Now.AddDays(3),
                    Priority = Utils.Enums.Priority.Medium,
                    Status = Utils.Enums.Status.Failed,
                    Title = "Test Assignment Two",
                    UpdatedAt = DateTime.Now,
                    UserId = userSecondId
                };

                dbContext.Users.AddRange([user, userSecond]);
                dbContext.UserTokens.AddRange([resetToken, invalidResetToken, verifyToken, invalidVerifyToken]);
                dbContext.RefreshTokens.Add(validRefreshToken);
                dbContext.Assignments.AddRange([assignment, assignmentSecond]);
            }
        }
    }
}
