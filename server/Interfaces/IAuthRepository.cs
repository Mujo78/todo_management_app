﻿using server.DTO;
using server.Models;

namespace server.Interfaces
{
    public interface IAuthRepository
    {
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<string> CreateRefreshToken(Guid userId, string tokenId);
        Guid? GetUserId();
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
    }
}