using server.Models;

namespace server.Repository.IRepository
{
    public interface IAuthRepository
    {
        Task<User?> GetUser(string userEmail);
        Task<User?> GetUser(Guid userId);
        Task<bool> CreateRefreshToken(RefreshToken token);
        Task<RefreshToken?> GetRefreshToken(string tokenId);
        Task<RefreshToken?> GetRefreshToken(Guid userId);
        Task Logout(RefreshToken refreshToken);
        Task<bool> Save();
    }
}
