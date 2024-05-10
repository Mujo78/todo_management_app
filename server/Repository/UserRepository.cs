﻿using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTO;
using server.Interfaces;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext db;
        private IConfiguration configuration;
        private string? secretKey;
        public UserRepository(ApplicationDBContext db, IConfiguration configuration)
        {
            this.db = db;
            this.configuration = configuration;
            this.secretKey = configuration["ApiSettings:Secret"];
        }

        public bool EmailAlreadyUsed(string email)
        {
            return db.Users.Any(n => n.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> getUser(int userId)
        {
            var user = await db.Users.FirstAsync(n => n.Id == userId);

            return user;
        }

        public async Task<User?> getUser(string userEmail)
        {
            var user = await db.Users.FirstAsync(n => n.Email == userEmail);

            return user;
        }

        public async Task<User?> Register(RegistrationDTO registrationDTO)
        {
            User user = new()
            {
                Name = registrationDTO.Name,
                Email = registrationDTO.Email,
                Password = registrationDTO.Password,
            };

            await db.Users.AddAsync(user);
            bool success = await Save();

            return success ? user : null;
        }

        public async Task<TokenDTO> Login(LoginDTO loginDTO)
        {
            var user = db.Users.FirstOrDefault(u => u.Email == loginDTO.Email);

            if (user == null) return new() { AccessToken = "" };

            bool valid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);

            if (!valid) return new() { AccessToken = "" };

            var jwtTokenId = $"JTI{Guid.NewGuid()}";
            var accessToken = CreateAccessToken(user, jwtTokenId);
            var refreshToken = await CreateRefreshToken(user.Id, jwtTokenId);

            TokenDTO token = new TokenDTO()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            return token;
        }

        public async Task<string> CreateRefreshToken(int userId, string tokenId)
        {
            RefreshToken token = new()
            {
                UserId = userId,
                JwtTokenId = tokenId,
                Refresh_Token = GenerateRefreshToken(),
                IsValid = true,
                ExpiresAt = DateTime.UtcNow.AddDays(90)
            };

            await db.RefreshTokens.AddAsync(token);
            await db.SaveChangesAsync();

            return token.Refresh_Token;
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0 ? true : false;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string CreateAccessToken(User user, string tokenId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey ?? "");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(JwtRegisteredClaimNames.Jti, tokenId),
                    new(JwtRegisteredClaimNames.Aud, user.Email),
                    new(JwtRegisteredClaimNames.Sub, user.Email),
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenStr = tokenHandler.WriteToken(token);

            return tokenStr;

        }
    }
}
