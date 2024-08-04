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
using server.DTO.User;

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

        public async Task<UserTokenDTO> Login(LoginDTO loginDTO)
        {
            var user = await repository.GetUser(loginDTO.Email) ?? throw new NotFoundException("Account doesn't exists.");

            bool isValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password);
            if (!isValid || !user.EmailConfirmed) throw new BadRequestException("Incorrect email or password.");

            string jwtTokenId = $"JTI{Guid.NewGuid()}";
            string refreshToken = await CreateOrFindRefreshToken(user.Id, jwtTokenId);
            string accessToken = CreateAccessToken(user, jwtTokenId);

            UserDTO userDTO = new()
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = DateTime.UtcNow,
            };

            UserTokenDTO token = new()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userDTO
            };

            if (string.IsNullOrEmpty(token.RefreshToken)) throw new BadRequestException("Incorrect email or password.");

            return token;
        }

        public async Task Logout(string refreshToken)
        {
            var refreshTokenFounded = await repository.GetRefreshToken(refreshToken) ?? throw new NotFoundException("Invalid token provided. Token not found.");
            try
            {
                await repository.Logout(refreshTokenFounded);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> CreateOrFindRefreshToken(Guid userId, string tokenId)
        {
            var refresh_token = await repository.GetRefreshToken(userId);

            if (refresh_token == null)
            {
                RefreshToken token = new()
                {
                    UserId = userId,
                    JwtTokenId = tokenId,
                    Refresh_Token = GenerateRefreshToken(),
                    IsValid = true,
                    ExpiresAt = DateTime.Now.AddDays(7)
                };

                bool result = await repository.CreateRefreshToken(token);
                return result ? token.Refresh_Token : "";

            }
            else
            {
                return refresh_token.Refresh_Token;
            }

        }

        public async Task<AccessTokenDTO> RefreshAccessToken(string refreshToken, string accessToken)
        {
            var existingRefreshToken = await repository.GetRefreshToken(refreshToken) ?? throw new NotFoundException("Invalid token provided.");
            var user = await repository.GetUser(existingRefreshToken.UserId) ?? throw new NotFoundException("User not found.");

            if (!existingRefreshToken.IsValid) httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.None,
            });

            bool isTokenValid = IsAccessTokenValid(accessToken, existingRefreshToken.UserId, existingRefreshToken.JwtTokenId);
            if (!isTokenValid) throw new BadRequestException("Invalid token provided.");

            var newAccessToken = CreateAccessToken(user, existingRefreshToken.JwtTokenId);

            return new AccessTokenDTO()
            {
                AccessToken = newAccessToken
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
                Expires = DateTime.Now.AddHours(2),
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
            var tokenIsValidToken = handler.CanReadToken(accessToken);

            if (tokenIsValidToken)
            {
                var token = handler.ReadJwtToken(accessToken);
                var userId = token.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
                var tokenId = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;

                return userId != null && tokenId != null && new Guid(userId).Equals(expectedUserId) && tokenId.Equals(jwtTokenId);
            }
            return false;
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
