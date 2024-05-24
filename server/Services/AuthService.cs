using Microsoft.IdentityModel.Tokens;
using server.DTO.Auth;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using server.Exceptions;
using System.Text;

namespace server.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository repository;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IConfiguration configuration;
        private readonly string? secretKey;

        public AuthService(IAuthRepository repository, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            this.repository = repository;
            this.httpContextAccessor = httpContextAccessor;
            this.configuration = configuration;
            secretKey = this.configuration["ApiSettings:Secret"];
        }

        public async Task<TokenDTO> Login(LoginDTO loginDTO)
        {
            var user = await repository.GetUser(loginDTO.Email) ?? throw new NotFoundException("User not found.");

            bool isValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);
            if (!isValid) throw new BadRequestException("Incorrect email or password.");

            string jwtTokenId = $"JTI{Guid.NewGuid()}";
            string refreshToken = await CreateRefreshToken(user.Id, jwtTokenId);
            string accessToken = CreateAccessToken(user, jwtTokenId);

            TokenDTO token = new()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            if (string.IsNullOrEmpty(token.RefreshToken)) throw new BadRequestException("Incorrect email or password.");

            return token;
        }

        public async Task<bool> Logout(TokenDTO tokenDTO)
        {
            var refreshToken = await repository.GetRefreshToken(tokenDTO.RefreshToken) ?? throw new NotFoundException("Invalid token provided.");
            return await repository.Logout(refreshToken);
        }

        public async Task<string> CreateRefreshToken(Guid userId, string tokenId)
        {
            RefreshToken token = new()
            {
                UserId = userId,
                JwtTokenId = tokenId,
                Refresh_Token = GenerateRefreshToken(),
                IsValid = true,
                ExpiresAt = DateTime.Now.AddMinutes(1)
            };

            bool result = await repository.CreateRefreshToken(token);
            return result ? token.Refresh_Token : "";
        }

        public async Task<TokenDTO> RefreshAccessToken(TokenDTO tokenDTO)
        {
            var existingRefreshToken = await repository.GetRefreshToken(tokenDTO.RefreshToken) ?? throw new NotFoundException("Invalid token provided.");
            var user = await repository.GetUser(existingRefreshToken.UserId) ?? throw new NotFoundException("User not found.");

            bool isTokenValid = IsAccessTokenValid(tokenDTO.AccessToken, existingRefreshToken.UserId, existingRefreshToken.JwtTokenId);
            if (!isTokenValid) throw new BadRequestException("Invalid token provided.");

            var newAccessToken = CreateAccessToken(user, existingRefreshToken.JwtTokenId);

            return new TokenDTO()
            {
                AccessToken = newAccessToken,
                RefreshToken = existingRefreshToken.Refresh_Token
            };
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
                Expires = DateTime.Now.AddMinutes(1),
                Issuer = configuration.GetValue<string>("ApiSettings:Issuer")!,
                Audience = configuration.GetValue<string>("ApiSettings:Audience")!,
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenStr = tokenHandler.WriteToken(token);

            return tokenStr;

        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public bool IsAccessTokenValid(string accessToken, Guid expectedUserId, string jwtTokenId)
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(accessToken);

            var userId = token.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            var tokenId = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

            return userId != null && tokenId != null && new Guid(userId).Equals(expectedUserId) && tokenId.Equals(jwtTokenId);
        }

        public Guid? GetUserId()
        {
            var userId = httpContextAccessor?.HttpContext?.User.FindFirstValue("userId");

            if (userId != null)
            {
                if (Guid.TryParse(userId, out Guid result))
                {
                    return result;
                }
            }

            return null;
        }
    }
}
