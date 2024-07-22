using server.DTO.User;
using System.Net;
using System.Net.Http.Json;

namespace server.IntegrationTests.Controllers
{
    public class UserAuthControllerIntegrationTests(ServerWebApplicationFactory factory) : TestBase(factory), IClassFixture<ServerWebApplicationFactory>
    {

        [Fact]
        public async Task GetMyProfileInfo_ShouldReturnUnauthorized()
        {
            var response = await _client.GetAsync("/api/v1/users/my-info");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetMyProfileInfo_ShouldBeSuccess()
        {
            var response = await _authorizedClient.GetAsync("/api/v1/users/my-info");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<MyInfoDTO>();
            Assert.NotNull(content);
            Assert.Equal("user12345@gmail.com", content!.User.Email);
        }

        [Fact]
        public async Task UpdateMyProfile_NotAuthorizedToAccessResources()
        {
            UserUpdateDTO updateDTO = new()
            {
                Email = "user12345@gmail.com",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                Name = "Test User One",
                Id = Guid.NewGuid(),
            };

            var response = await _authorizedClient.PutAsJsonAsync("/api/v1/users/", updateDTO);
            
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("You are not authorize to access these resources.", content!.Detail);
        }

        [Fact]
        public async Task UpdateMyProfile_ShouldReturnConflict_EmailUsed()
        {
            UserUpdateDTO updateDTO = new()
            {
                Email = "user123@gmail.com",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                Name = "Test User One",
                Id = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e"),
            };

            var response = await _authorizedClient.PutAsJsonAsync("/api/v1/users/", updateDTO);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Email is already used!", content!.Detail);
        }

        [Fact]
        public async Task UpdateMyProfile_ShouldBeSuccess()
        {
            UserUpdateDTO updateDTO = new()
            {
                Email = "user123456@gmail.com",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                Name = "Test User One",
                Id = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e"),
            };

            var response = await _authorizedClient.PutAsJsonAsync("/api/v1/users/", updateDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<UserDTO>();
            Assert.NotNull(content);
            Assert.Equal(updateDTO.Email, content!.Email);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_WhenOldPasswordIsWrong()
        {
            ChangePasswordDTO changePasswordDTO = new()
            {
                OldPassword = "wrongPasswordHere",
                NewPassword = "newPasswordHere&12345",
                ConfirmNewPassword = "newPasswordHere&12345"
            };

            var response = await _authorizedClient.PostAsJsonAsync("/api/v1/users/change-password", changePasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Wrong old password.", content!.Detail);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_WhenPasswordsDontMatch()
        {
            ChangePasswordDTO changePasswordDTO = new()
            {
                OldPassword = "Password&123456",
                NewPassword = "newPasswordHere&123456",
                ConfirmNewPassword = "newPasswordHere&12345"
            };

            var response = await _authorizedClient.PostAsJsonAsync("/api/v1/users/change-password", changePasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("New password and confirm password must match.", content!.Detail);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_WhenOldPasswordAndNewAreSame()
        {
            ChangePasswordDTO changePasswordDTO = new()
            {
                OldPassword = "Password&123456",
                NewPassword = "Password&123456",
                ConfirmNewPassword = "Password&123456"
            };

            var response = await _authorizedClient.PostAsJsonAsync("/api/v1/users/change-password", changePasswordDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("New password cannot be the same as the old password.", content!.Detail);
        }

        [Fact]
        public async Task ChangePassword_ShouldBeSuccess()
        {
            ChangePasswordDTO changePasswordDTO = new()
            {
                OldPassword = "Password&123456",
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };

            var response = await _authorizedClient.PostAsJsonAsync("/api/v1/users/change-password", changePasswordDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Password successfully changed.", content);
        }

        [Fact]
        public async Task DeleteMyProfile_ShouldReturnUnauthorized()
        {
            var response = await _client.DeleteAsync("/api/v1/users");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteMyProfile_ShouldBeSuccess()
        {
            var response = await _authorizedClient.DeleteAsync("/api/v1/users");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Profile succesfully deleted.", content);
        }
    }
}
