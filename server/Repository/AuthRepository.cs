using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Repository.IRepository;

namespace server.Repository
{
    public class AuthRepository(ApplicationDBContext db) : IAuthRepository
    {
        private readonly ApplicationDBContext db = db;

        public async Task<User?> GetUser(string userEmail)
        {
            return await db.Users.FirstOrDefaultAsync(n => n.Email.Equals(userEmail));
        }

        public async Task<User?> GetUser(Guid userId)
        {
            return await db.Users.FirstOrDefaultAsync(n => n.Id.Equals(userId));
        }

        public async Task<bool> CreateRefreshToken(RefreshToken token)
        {
            await db.RefreshTokens.AddAsync(token);
            return await Save();
        }

        public async Task Logout(RefreshToken refreshToken)
        {
            db.RefreshTokens.Remove(refreshToken);
            await db.SaveChangesAsync();
        }
        public async Task<RefreshToken?> GetRefreshToken(string tokenId)
        {
            return await db.RefreshTokens.FirstOrDefaultAsync(r => r.Refresh_Token == tokenId && r.IsValid && r.ExpiresAt > DateTime.Now);
        }

        public async Task<RefreshToken?> GetRefreshToken(Guid userId)
        {
            return await db.RefreshTokens.FirstOrDefaultAsync(r => r.UserId.Equals(userId) && r.IsValid && r.ExpiresAt > DateTime.Now);
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0;
        }
    }
}
