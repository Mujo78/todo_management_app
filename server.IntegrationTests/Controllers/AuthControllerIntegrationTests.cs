using System.Net.Http.Json;
using System.Net;
using server.DTO.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.IntegrationTests.Controllers
{
    public class AuthControllerIntegrationTests(ServerWebApplicationFactory factory) : TestBase(factory), IClassFixture<ServerWebApplicationFactory>
    {
        [Fact]
        public async Task Login_ShouldReturnNotFound_WhenUserNotExists()
        {
            LoginDTO data = new()
            {
                Email = "user1234567890@gmail.com",
                Password = "Password&123456",
            };

            var response = await _client.PostAsJsonAsync("/login", data);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Account doesn't exists.", content.Detail);
        }



        [Fact]
        public async Task Login_ShouldReturnBadRequest_WhenPasswordIsNotCorrect()
        {
            LoginDTO loginDTO = new()
            {
                Email = "user123@gmail.com",
                Password = "Password&1234567890"
            };

            var response = await _client.PostAsJsonAsync("/login", loginDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Incorrect email or password.", content.Detail);
        }

        [Fact]
        public async Task Login_ShouldBeSuccess()
        {
            LoginDTO loginDTO = new()
            {
                Email = "user123@gmail.com",
                Password = "Password&123456"
            };

            var response = await _client.PostAsJsonAsync("/login", loginDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<LoginDataDTO>();
            Assert.NotNull(content);
            Assert.Equal("user123@gmail.com", content.User.Email);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldReturnNotFound_WhenRefreshTokenNotExists()
        {
            string accessToken = "s1mpl3-6cc3ss-t0k3n";
            string refreshToken = "1nval1d-s1mpl3-r3fr36h-t0k3n";

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            _client.DefaultRequestHeaders.Add("Cookie", $"refreshToken={refreshToken}");

            var response = await _client.PostAsJsonAsync("/api/auth/refresh", "");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Invalid token provided.", content.Detail);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldReturnBadRequest_WhenAccessTokenIsNotValid()
        {
            
            string accessToken = "s1mpl3-6cc3ss-t0k3n";
            string refreshToken = "s1mpl3-r3fr36h-t0k3n";

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            _client.DefaultRequestHeaders.Add("Cookie", $"refreshToken={refreshToken}");

            var response = await _client.PostAsJsonAsync("/api/auth/refresh", "");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Invalid token provided.", content.Detail);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldBeSuccess()
        {
            Guid userOneId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            Guid refreshTokenJTI = Guid.Parse("18b62733-3733-405d-9a83-bd5efa55435d");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("accessTokenForTestingOnlyKeyGoesHere" ?? "");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(JwtRegisteredClaimNames.Jti, refreshTokenJTI.ToString()),
                    new("userId", userOneId.ToString()),
                    new(JwtRegisteredClaimNames.Email, "user12345@gmail.com"),
                    new(JwtRegisteredClaimNames.Name, "User Test Integration Name"),
                }),
                Expires = DateTime.Now.AddSeconds(1),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string accessToken = tokenHandler.WriteToken(token);

            string refreshToken = "s1mpl3-r3fr36h-t0k3n";

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            _client.DefaultRequestHeaders.Add("Cookie", $"refreshToken={refreshToken}");

            var response = await _client.PostAsJsonAsync("/api/auth/refresh", "");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AccessTokenDTO>();
            Assert.NotNull(content);
            Assert.IsType<AccessTokenDTO>(content);
        }

    }
}
