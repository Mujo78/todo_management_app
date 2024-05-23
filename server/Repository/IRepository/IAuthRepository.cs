using server.Models;

namespace server.Repository.IRepository
{
    public interface IAuthRepository
    {
        Task<User?> GetUser(string userEmail);
        Task<User?> GetUser(Guid userId);
        Task<bool> ForgotPassword(string email);
        Task<bool> CreateRefreshToken(RefreshToken token);
        Task<RefreshToken?> GetRefreshToken(string tokenId);
        Task<bool> Logout(RefreshToken refreshToken);
        public Task<bool> Save();
    }
}
