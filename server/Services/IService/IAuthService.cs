using server.DTO.Auth;
using server.Models;

namespace server.Services.IService
{
    public interface IAuthService
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<bool> Logout(TokenDTO tokenDTO);
        Task<string> CreateRefreshToken(Guid userId, string tokenId);
        Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        public bool IsAccessTokenValid(string accesToken, Guid exprectedUserId, string jwtTokenId);
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
    }
}
