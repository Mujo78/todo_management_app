using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services.IService;

namespace server.Services
{
    public class TokenCleanupService(IServiceScopeFactory serviceScopeFactory) : ITokenCleanupService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;

        public async Task CleanupInvalidTokens()
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

        public bool IsRefreshTokenValid(RefreshToken refreshToken)
        {
            return refreshToken.IsValid && refreshToken.ExpiresAt > DateTime.Now;
        }

        public void DeleteRefreshToken(ApplicationDBContext db, RefreshToken token)
        {
            db.Remove(token);
        }
        public async Task<IEnumerable<RefreshToken>> GetInvalidRefreshTokens(ApplicationDBContext db)
        {
            return await db.RefreshTokens.Where(r => r.IsValid && r.ExpiresAt < DateTime.Now).ToListAsync();
        }
    }
}
