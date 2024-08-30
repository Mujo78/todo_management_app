using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers;
using server.DTO.Auth;
using server.DTO.User;
using server.Exceptions;
using server.Services.IService;

namespace server.Tests.Controllers
{
    public class AuthControllerTests
    {

        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _controller;
        private readonly Mock<IResponseCookies> _responseCookiesMock;
        private readonly HttpContext _httpContext;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();

            _responseCookiesMock = new Mock<IResponseCookies>();

            var responseMock = new Mock<HttpResponse>();
            responseMock.SetupGet(r => r.Cookies).Returns(_responseCookiesMock.Object);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(c => c.Response).Returns(responseMock.Object);

            _controller = new AuthController(_authServiceMock.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = httpContextMock.Object
                }
            };

            _httpContext = httpContextMock.Object;
        }

        [Fact]
        public async Task Login_ShouldFail_WhenDataIsNotProvided()
        {
            LoginDTO? loginDTO = null;

            var result = await _controller.Login(loginDTO!);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("loginService.loginValidData", badRequestResult.Value);
        }

        [Fact]
        public async Task Login_ShouldFail_WhenEmailIsNotProvided()
        {
            LoginDTO loginDTO = new()
            {
                Email = "",
                Password = "Password&12345"
            };

            _controller.ModelState.AddModelError("Email", "The field Email is required.");

            var result = await _controller.Login(loginDTO);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("Email"));
            Assert.Contains("The field Email is required.", (string[])modelState["Email"]);
        }

        [Fact]
        public async Task Login_ShouldBeSuccess()
        {
            LoginDTO loginDTO = new()
            {
                Email = "user@gmail.com",
                Password = "Password&12345"
            };

            UserTokenDTO expectedTokenToReturn = new()
            {
                AccessToken = "accessToken",
                RefreshToken = "refreshTokenToReturn",
                User = new UserDTO
                {
                    CreatedAt = DateTime.UtcNow,
                    Email = loginDTO.Email,
                    Name = "User Test One",
                    EmailConfirmed = true,
                    Id = Guid.NewGuid(),
                }
            };

            LoginDataDTO loginDataDTO = new() { User = expectedTokenToReturn.User, AccessToken = expectedTokenToReturn.AccessToken, };

            _authServiceMock.Setup(service => service.Login(loginDTO)).ReturnsAsync(expectedTokenToReturn);
            var result = await _controller.Login(loginDTO);

            var resultValue = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<LoginDataDTO>(resultValue.Value);

            _responseCookiesMock.Verify(cookies => cookies.Append(
            "refreshToken",
            expectedTokenToReturn.RefreshToken,
            It.Is<CookieOptions>(option =>
                option.HttpOnly == true &&
                option.Secure == true &&
                option.IsEssential == true &&
                option.SameSite == SameSiteMode.None &&
                Math.Abs((option.Expires!.Value - DateTimeOffset.Now.AddDays(7)).TotalSeconds) < 1
            )), Times.Once);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldFail_WhenThereIsNoAccessTokenProvided()
        {
            var httpContext = new DefaultHttpContext();

            httpContext.Request.Headers.Authorization = "";

            _controller.ControllerContext = new()
            {
                HttpContext = httpContext
            };

            var result = await Assert.ThrowsAsync<BadRequestException>(() => _controller.GetAccessTokenWithRefreshAction());
            Assert.Equal("validateUserTokenService.invalidToken", result.Message);
        }

        [Fact]
        public async Task RefreshAccessToken_ShouldBeSuccess()
        {
            var httpContext = new DefaultHttpContext();
            var newCookies = new[] { "refreshToken=refreshAccessToken" };

            httpContext.Request.Headers.Authorization = "Bearer accessValidTokenCreated";
            httpContext.Request.Headers.Cookie = newCookies;

            _controller.ControllerContext = new()
            {
                HttpContext = httpContext
            };

            var tokenDTO = new AccessTokenDTO()
            {
                AccessToken = "accessValidTokenCreated"
            };

            _authServiceMock.Setup(service => service.RefreshAccessToken("refreshAccessToken", "accessValidTokenCreated")).ReturnsAsync(tokenDTO);
            var result = await _controller.GetAccessTokenWithRefreshAction();
            var resultValue = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<AccessTokenDTO>(resultValue.Value);

            Assert.Equal(tokenDTO.AccessToken, value.AccessToken);
        }

        [Fact]
        public async Task Logout_ShouldFail_WhenNoRefreshTokenProvided()
        {
            var httpContext = new DefaultHttpContext();
            var newCookies = new[] { "refreshToken=" };

            httpContext.Request.Headers.Authorization = "Bearer accessValidTokenCreated";
            httpContext.Request.Headers.Cookie = newCookies;

            _controller.ControllerContext = new()
            {
                HttpContext = httpContext
            };

            var result = await Assert.ThrowsAsync<BadRequestException>(() => _controller.Logout());
            Assert.Equal("logoutService.invalidToken", result.Message);
        }

        [Fact]
        public async Task Logout_ShouldBeSuccess()
        {
            var httpContext = new DefaultHttpContext();
            var newCookies = new[] { "refreshToken=refreshAccessToken" };

            httpContext.Request.Headers.Authorization = "Bearer accessValidTokenCreated";
            httpContext.Request.Headers.Cookie = newCookies;

            _controller.ControllerContext = new()
            {
                HttpContext = httpContext
            };

            var tokenDTO = new AccessTokenDTO()
            {
                AccessToken = "accessValidTokenCreated"
            };

            _authServiceMock.Setup(service => service.Logout("refreshAccessToken")).Returns(Task.CompletedTask);

            var result = await _controller.Logout();
            var resultValue = Assert.IsType<OkObjectResult>(result);

            Assert.Equal("logoutService.successMessage", resultValue.Value);
            Assert.DoesNotContain(httpContext.Response.Headers["refreshToken"], cookie => cookie!.Contains("refreshToken"));
        }

    }
}
