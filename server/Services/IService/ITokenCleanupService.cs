using server.Models;

namespace server.Services.IService
{
    public interface ITokenCleanupService
    {
        Task CleanupInvalidRefreshTokens();
        Task CleanupInvalidUserTokens();
    }
}
