using server.DTO.Auth;
using server.Models;

namespace server.Services.IService
{
    public interface IAuthService
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task Logout(TokenDTO tokenDTO);
        Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO);
        Guid? GetUserId();
    }
}
