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
                modelBuilder.Entity<User>().HasData(
                    new User
                    {
                        Id = Guid.NewGuid(),
                        Name = "User Testing One",
                        CreatedAt = DateTime.Now,
                        Email = "user-testing@example.com",
                        EmailConfirmed = true,
                        Password = BCrypt.Net.BCrypt.HashPassword("Password&123456")
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