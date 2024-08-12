using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options, IWebHostEnvironment env) : DbContext(options)
    {
        private readonly IWebHostEnvironment _env = env;

        public DbSet<User> Users { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            if (_env.EnvironmentName == "Staging")
            {
                Guid firstUserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4");
                Guid secondUserId = Guid.Parse("6fe71ee1-830f-4e00-8257-cd3591423505");
                Guid thirdUserId = Guid.Parse("8d3716ab-ae98-473f-9a6b-5d53b8d46682");
                string verificationToken = "25f78624-0c9b-4b63-b61e-d5b297e56f82";
                string resetPasswordToken = "5508116c-f287-4e54-8e9d-b556fdc9eeeb";

                modelBuilder.Entity<User>().HasData(
                    new User
                    {
                        Id = firstUserId,
                        Name = "User Testing One",
                        CreatedAt = DateTime.Now,
                        Email = "user-testing@example.com",
                        EmailConfirmed = true,
                        Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
                    },
                    new User
                    {
                        Id = secondUserId,
                        Name = "User Testing Second",
                        CreatedAt = DateTime.Now,
                        Email = "user-testing-second@example.com",
                        EmailConfirmed = false,
                        Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
                    },
                    new User
                    {
                        Id = thirdUserId,
                        Name = "User Testing Third",
                        CreatedAt = DateTime.Now,
                        Email = "user-testing-third@example.com",
                        EmailConfirmed = true,
                        Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
                    },
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "User To Delete",
                        CreatedAt = DateTime.Now,
                        Email = "user-testing-to-delete@example.com",
                        EmailConfirmed = true,
                        Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
                    }
                    );
                modelBuilder.Entity<UserToken>().HasData(
                    new UserToken
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.Now,
                        ExpiresAt = DateTime.Now.AddDays(2),
                        UserId = secondUserId,
                        TokenType = Utils.Enums.TokenType.EmailVerification,
                        Token = verificationToken,
                    },
                    new UserToken
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.Now,
                        ExpiresAt = DateTime.Now.AddDays(2),
                        UserId = thirdUserId,
                        TokenType = Utils.Enums.TokenType.PasswordReset,
                        Token = resetPasswordToken,
                    }
                    );
            }

            modelBuilder.Entity<User>()
                .HasOne(u => u.RefreshToken)
                .WithOne(r => r.User)
                .HasForeignKey<RefreshToken>(f => f.UserId);
        }
    }
}