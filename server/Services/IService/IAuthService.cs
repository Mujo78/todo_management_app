using server.DTO.Auth;

namespace server.Services.IService
{
    public interface IAuthService
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task Logout(string refreshToken);
        Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        Guid? GetUserId();
    }
}
