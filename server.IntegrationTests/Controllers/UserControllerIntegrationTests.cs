using server.DTO.Auth;
using server.DTO.User;
using System.Net;
using System.Net.Http.Json;

namespace server.IntegrationTests.Controllers
{
    [Collection("Integration Tests")]
    public class UserControllerIntegrationTests(ServerWebApplicationFactory factory) : TestBase(factory), IClassFixture<ServerWebApplicationFactory>
    {
        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenPasswordDontMatch()
        {
            RegistrationDTO data = new()
            {
                Email = "user123@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&123456",
                ConfirmPassword = "Password&12345"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/registration", data);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("registrationService.passwordsMustMatch", content.Detail);

        }


        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenEmailIsAlreadyUsed()
        {
            RegistrationDTO data = new()
            {
                Email = "user123@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/registration", data);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("registrationService.emailAlreadyUsed", content.Detail);
        }

        [Fact]
        public async Task Registration_ShouldBeSuccess()
        {
            RegistrationDTO data = new()
            {
                Email = "user12345678@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/registration", data);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("registrationService.successMessage", content);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnNotFound_WhenUserDontExists()
        {
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user0123456789@gmail.com"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("forgotPasswordService.userNotFound", content.Detail);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnConflict_WhenResetLinkAlreadyCreated()
        {
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user123@gmail.com"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("forgotPasswordService.resetLinkAlreadyCreated", content.Detail);
        }

        [Fact]
        public async Task ForgotPassword_ShouldBeSuccess()
        {
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user12345@gmail.com"
            };

            var response = await _client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("forgotPasswordService.successMessage", content);
        }


        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenPasswordsDontMatch()
        {
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&123456"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("resetPasswordService.passwordsMustMatch", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnNotFound_WhenTokenNotFound()
        {
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rdssss";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("validateUserTokenService.invalidTokenNotFound", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenTokenIsNotValid()
        {
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            var token = "1nval1d-s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("validateUserTokenService.invalidToken", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenNewPasswordIsSameAsTheOld()
        {
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&123456",
                ConfirmNewPassword = "Password&123456"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("resetPasswordService.newPasswordSameAsOld", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldBeSuccess()
        {
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };

            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("resetPasswordService.successMessage", content);
        }

        [Fact]
        public async Task VerifyEmail_ShouldReturnNotFound_WhenTokenNotFounded()
        {
            var token = "s1mple-t0k3n-f0r-v3r1fy-3mA1l";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/verify/{token}", "");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("validateUserTokenService.invalidTokenNotFound", content.Detail);
        }

        [Fact]
        public async Task VerifyEmail_ShouldReturnBadRequest_WhenTokenIsNotValid()
        {
            var token = "1nval1d-s1mple-t0k3n-f0r-v3r1fy-3m61l";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/verify/{token}", "");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("validateUserTokenService.invalidToken", content.Detail);
        }
        
        [Fact]
        public async Task VerifyEmail_ShouldBeSuccess()
        {
            var token = "s1mple-t0k3n-f0r-v3r1fy-3m61l";
            var response = await _client.PatchAsJsonAsync($"/api/v1/users/verify/{token}", "");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("verifyEmailService", content);
        }
    }
}
