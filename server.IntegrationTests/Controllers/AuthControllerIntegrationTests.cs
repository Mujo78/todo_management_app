using System.Net.Http.Json;
using System.Net;
using server.DTO.Auth;

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
            Assert.Equal("loginService.accountDoesntExists", content.Detail);
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
            Assert.Equal("loginService.incorrectEmailOrPassword", content.Detail);
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
            Assert.Equal("validateUserTokenService.invalidTokenNotFound", content.Detail);
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
            Assert.Equal("validateUserTokenService.invalidToken", content.Detail);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldBeSuccess()
        {
            string accessToken = GenerateAccessTokenForTesting(DateTime.Now.AddSeconds(1));
            string refreshToken = "s1mpl3-r3fr36h-t0k3n";

            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            _client.DefaultRequestHeaders.Add("Cookie", $"refreshToken={refreshToken}");

            var response = await _client.PostAsJsonAsync("/api/auth/refresh", "");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AccessTokenDTO>();
            Assert.NotNull(content);
            Assert.IsType<AccessTokenDTO>(content);
        }

        [Fact]
        public async Task Logout_ShouldReturnUnauthorized()
        {
            var response = await _client.DeleteAsync("/api/auth/logout");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Logout_ShouldReturnNotFound_WhenRefreshTokenNotExists()
        {
            var authClient = _authorizedClient;
            authClient.DefaultRequestHeaders.Add("Cookie", $"refreshToken=refreshToken");
            var response = await authClient.DeleteAsync("/api/auth/logout");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("logoutService.invalidTokenNotFound", content!.Detail);
        }

        [Fact]
        public async Task Logout_ShouldBeSuccess()
        {
            var response = await _authorizedClient.DeleteAsync("/api/auth/logout");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("logoutService.successMessage", content);
        }
    }
}
