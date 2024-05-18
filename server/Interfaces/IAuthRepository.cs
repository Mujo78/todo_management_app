using server.DTO.Auth;
using server.Models;

namespace server.Interfaces
{
    public interface IAuthRepository
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<bool> ForgotPassword(string email);
        Task<string> CreateRefreshToken(Guid userId, string tokenId);
        Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        Task<RefreshToken?> GetRefreshToken(string tokenId);
        Task<bool> Logout(TokenDTO tokenDTO);
        Guid? GetUserId();
        public bool IsAccessTokenValid(string accesToken, Guid exprectedUserId, string jwtTokenId);
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
        public Task<bool> Save();
    }
}
