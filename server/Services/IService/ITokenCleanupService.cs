using server.Models;

namespace server.Services.IService
{
    public interface ITokenCleanupService
    {
        Task CleanupInvalidRefreshTokens();
        bool IsRefreshTokenValid(RefreshToken refreshToken);
        Task CleanupInvalidUserTokens();
        bool IsUserTokenValid(UserToken userToken);
    }
}
