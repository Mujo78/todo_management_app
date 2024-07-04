using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Services.IService;
using server.Utils.Enums;

namespace server.Services
{
    public class BackgroundJobService(IServiceScopeFactory serviceScopeFactory) : IBackgroundJobService
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

        public async Task MakeAssignmentsFailed()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
            var assignments = await GetExpiredAssignments(dbContext);

            foreach (var assignment in assignments)
            {
                assignment.Status = Status.Failed;
                assignment.UpdatedAt = DateTime.Now;
            }

            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
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

        public async Task<IEnumerable<Assignment>> GetExpiredAssignments(ApplicationDBContext db)
        {
            return await db.Assignments.Where(a => a.DueDate.CompareTo(DateTime.Now) < 0 && !a.Status.Equals(Status.Completed)).ToListAsync();
        }
    }
}
