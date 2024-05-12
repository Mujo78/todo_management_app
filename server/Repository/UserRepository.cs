using BCrypt.Net;
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
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IConfiguration configuration;
        private readonly string? secretKey;
        public UserRepository(ApplicationDBContext db, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            this.db = db;
            this.configuration = configuration;
            this.secretKey = this.configuration["ApiSettings:Secret"];
            this.httpContextAccessor = httpContextAccessor;
        }

        public bool EmailAlreadyUsed(string email)
        {
            return db.Users.Any(n => n.Email.ToLower().Equals(email.ToLower()));
        }

        public async Task<User?> GetUser(Guid userId)
        {
            var user = await db.Users.FirstAsync(n => n.Id.Equals(userId));

            return user;
        }

        public async Task<User?> GetUser(string userEmail)
        {
            var user = await db.Users.FirstAsync(n => n.Email.Equals(userEmail));

            return user;
        }

        public async Task<User?> Register(RegistrationDTO registrationDTO)
        {
            User user = new()
            {
                Name = registrationDTO.Name,
                Email = registrationDTO.Email,
                Password = registrationDTO.Password,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Users.AddAsync(user);
            bool success = await Save();

            return success ? user : null;
        }

        public async Task<TokenDTO> Login(LoginDTO loginDTO)
        {
            var user = db.Users.FirstOrDefault(u => u.Email.Equals(loginDTO.Email));

            if (user == null) return new() { AccessToken = "" };

            bool valid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);

            if (!valid) return new() { AccessToken = "" };

            var refreshExists = db.RefreshTokens.FirstOrDefault(r => r.UserId.Equals(user.Id));

            var jwtTokenId = $"JTI{Guid.NewGuid()}";
            var accessToken = CreateAccessToken(user, jwtTokenId);
            var refreshToken = refreshExists?.Refresh_Token ?? await CreateRefreshToken(user.Id, jwtTokenId);

            TokenDTO token = new()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            return token;
        }

        public async Task<string> CreateRefreshToken(Guid userId, string tokenId)
        {
            RefreshToken token = new()
            {
                UserId = userId,
                JwtTokenId = tokenId,
                Refresh_Token = GenerateRefreshToken(),
                IsValid = true,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };

            await db.RefreshTokens.AddAsync(token);
            await db.SaveChangesAsync();

            return token.Refresh_Token;
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0;
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
                    new("userId", user.Id.ToString()),
                    new(JwtRegisteredClaimNames.Email, user.Email),
                    new(JwtRegisteredClaimNames.Name, user.Name),
                }),
                Expires = DateTime.UtcNow.AddMinutes(20),
                Issuer = configuration.GetValue<string>("ApiSettings:Issuer")!,
                Audience = configuration.GetValue<string>("ApiSettings:Audience")!,
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenStr = tokenHandler.WriteToken(token);

            return tokenStr;

        }

        public Guid? GetUserId()
        {
            var userId = httpContextAccessor?.HttpContext?.User.FindFirstValue("userId");

            if(userId != null)
            {
                if(Guid.TryParse(userId, out Guid result))
                {
                    return result;
                }
            }

            return null;
        }
    }
}
