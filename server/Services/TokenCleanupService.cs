using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services.IService;

namespace server.Services
{
    public class TokenCleanupService(IServiceScopeFactory serviceScopeFactory) : ITokenCleanupService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;

        public async Task CleanupInvalidRefreshTokens()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            var invalidTokens = await GetInvalidRefreshTokens(dbContext);

            foreach (var invalidToken in invalidTokens)
            {
                DeleteRefreshToken(dbContext, invalidToken);
            }

            await dbContext.SaveChangesAsync();
        }

        public async Task CleanupInvalidUserTokens()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            var invalidTokens = await GetInvalidUserTokens(dbContext);

            foreach (var invalidToken in invalidTokens)
            {
                DeleteUserToken(dbContext, invalidToken);
            }

            await dbContext.SaveChangesAsync();
        }

        public bool IsRefreshTokenValid(RefreshToken refreshToken)
        {
            return refreshToken.IsValid && refreshToken.ExpiresAt > DateTime.Now;
        }
        public bool IsUserTokenValid(UserToken userToken)
        {
            return userToken.ExpiresAt > DateTime.Now;
        }

        private static void DeleteRefreshToken(ApplicationDBContext db, RefreshToken token)
        {
            db.RefreshTokens.Remove(token);
        }
        private static void DeleteUserToken(ApplicationDBContext db, UserToken userToken)
        {
            db.UserTokens.Remove(userToken);
        }
        private static async Task<IEnumerable<RefreshToken>> GetInvalidRefreshTokens(ApplicationDBContext db)
        {
            return await db.RefreshTokens.Where(r => r.IsValid && r.ExpiresAt < DateTime.Now).ToListAsync();
        }

        private static async Task<IEnumerable<UserToken>> GetInvalidUserTokens(ApplicationDBContext db)
        {
            return await db.UserTokens.Where(r => r.ExpiresAt < DateTime.Now).ToListAsync();
        }
    }
}
