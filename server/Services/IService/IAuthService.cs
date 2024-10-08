﻿using server.DTO.Auth;

namespace server.Services.IService
{
    public interface IAuthService
    {
        Task<UserTokenDTO> Login(LoginDTO loginDTO);
        Task Logout(string refreshToken);
        Task<AccessTokenDTO> RefreshAccessToken(string refreshToken, string accessToken);
        Task<LoginDataDTO> GetAccessTokenWithRefresh(string refreshToken);
        Task ResetDatabase();
        Guid? GetUserId();
    }
}
