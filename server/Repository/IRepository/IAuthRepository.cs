using server.DTO.Auth;
using server.Models;

namespace server.Repository.IRepository
{
    public interface IAuthRepository
    {
        // Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<User?> GetUser(string userEmail);
        Task<User?> GetUser(Guid userId);
        Task<bool> ForgotPassword(string email);
        Task<bool> CreateRefreshToken(RefreshToken token);
        // Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        Task<RefreshToken?> GetRefreshToken(string tokenId);
        Task<bool> Logout(RefreshToken refreshToken);
        Guid? GetUserId();
        // public bool IsAccessTokenValid(string accesToken, Guid exprectedUserId, string jwtTokenId);
       // string CreateAccessToken(User user, string tokenId);
       // string GenerateRefreshToken();
        public Task<bool> Save();
    }
}
