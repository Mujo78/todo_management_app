using server.DTO.Auth;
using server.Models;

namespace server.Interfaces
{
    public interface IAuthRepository
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        Task<string> CreateRefreshToken(Guid userId, string tokenId);
        Task<bool> ForgotPassword(string email);
        Guid? GetUserId();
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
        public Task<bool> Save();
    }
}
