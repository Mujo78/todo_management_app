using server.DTO.Auth;
using server.DTO.User;
using System.Net;
using System.Net.Http.Json;

namespace server.IntegrationTests.Controllers
{
    public class UserControllerIntegrationTests
    {

        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenPasswordDontMatch()
        {
            var factory = new ServerWebApplicationFactory(false);
            RegistrationDTO data = new()
            {
                Email = "user123@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&123456",
                ConfirmPassword = "Password&12345"
            };

            var client = factory.CreateClient();

            var response = await client.PostAsJsonAsync("/api/v1/users/registration", data);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Password and Confirm password must match.", content.Detail);

        }


        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenEmailIsAlreadyUsed()
        {
            var factory = new ServerWebApplicationFactory(true);
            RegistrationDTO data = new()
            {
                Email = "user123@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };

            var client = factory.CreateClient();

            var response = await client.PostAsJsonAsync("/api/v1/users/registration", data);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Email is already used!", content.Detail);
        }

        [Fact]
        public async Task Registration_ShouldBeSuccess()
        {
            var factory = new ServerWebApplicationFactory(false);
            RegistrationDTO data = new()
            {
                Email = "user12345678@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };

            var client = factory.CreateClient();

            var response = await client.PostAsJsonAsync("/api/v1/users/registration", data);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Please check your inbox, for verification email.", content);
        }
        
        [Fact]
        public async Task ForgotPassword_ShouldReturnNotFound_WhenUserDontExists()
        {
            var factory = new ServerWebApplicationFactory(false);
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user0123456789@gmail.com"
            };

            var client = factory.CreateClient();

            var response = await client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("User not found.", content.Detail);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnConflict_WhenResetLinkAlreadyCreated()
        {
            var factory = new ServerWebApplicationFactory(true);
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user123@gmail.com"
            };

            var client = factory.CreateClient();
            var response = await client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Reset password link already created. Please check your inbox.", content.Detail);
        }

        [Fact]
        public async Task ForgotPassword_ShouldBeSuccess()
        {
            var factory = new ServerWebApplicationFactory(true);
            ForgotPasswordDTO forgotPasswordDTO = new()
            {
                Email = "user12345@gmail.com"
            };

            var client = factory.CreateClient();
            var response = await client.PostAsJsonAsync("/api/v1/users/forgot-password", forgotPasswordDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Check your email inbox to proceede with restarting your password.", content);
        }

        
        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenPasswordsDontMatch()
        {
            var factory = new ServerWebApplicationFactory(false);
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&123456"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var client = factory.CreateClient();
            var response = await client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("New password and confirm password must match.", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnNotFound_WhenTokenNotFound()
        {
            var factory = new ServerWebApplicationFactory(false);
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rdssss";
            var client = factory.CreateClient();
            var response = await client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Invalid token provided. Token not found.", content.Detail);
        }

        
        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenTokenIsNotValid()
        {
            var factory = new ServerWebApplicationFactory(true);
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            var token = "1nval1d-s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var client = factory.CreateClient();
            var response = await client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Invalid token provided.", content.Detail);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenNewPasswordIsSameAsTheOld()
        {
            var factory = new ServerWebApplicationFactory(true);
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&123456",
                ConfirmNewPassword = "Password&123456"
            };
            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var client = factory.CreateClient();
            var response = await client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("New password cannot be the same as the old password.", content.Detail);
        }

        
        [Fact]
        public async Task ResetPassword_ShouldBeSuccess()
        {
            var factory = new ServerWebApplicationFactory(true);
            ResetPasswordDTO resetPasswordDTO = new()
            {
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };

            var token = "s1mple-t0k3n-f0r-r3s3t-pa6w0rd";
            var client = factory.CreateClient();
            var response = await client.PatchAsJsonAsync($"/api/v1/users/reset-password/{token}", resetPasswordDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Password successfully changed.", content);
        }
    }
}
