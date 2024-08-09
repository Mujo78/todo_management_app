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
            return await db.RefreshTokens.FirstOrDefaultAsync(r => r.UserId.Equals(userId));
        }

        public async Task ResetDB()
        {
            var tokenArray = new List<string>()
            {
                "25f78624-0c9b-4b63-b61e-d5b297e56f82",
                "5508116c-f287-4e54-8e9d-b556fdc9eeeb"
            };
            var newAddedTokens = await db.UserTokens.Where(token => !tokenArray.Contains(token.Token)).ToListAsync();
            
            if(newAddedTokens.Count != 0)
            {
                db.UserTokens.RemoveRange(newAddedTokens);
            }

            await db.SaveChangesAsync();
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0;
        }
    }
}
