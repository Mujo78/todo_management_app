using server.DTO.User;
using System.Net.Http.Json;

namespace server.IntegrationTests.Controllers
{
    public class UserControllerIntegrationTests
    {
        [Fact]
        public async Task Registration_ShouldBeSuccess()
        {
            var factory = new ServerWebApplicationFactory();
            RegistrationDTO data = new()
            {
                Email = "user123@gmail.com",
                Name = "User Test Integration Name",
                Password = "Password&123456",
                ConfirmPassword = "Password&12345"
            };

            var client = factory.CreateClient();

            var response = await client.PostAsJsonAsync("/api/v1/users/registration", data);

            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Contains("Password and Confirm password must match.", content);
        }
    }
}
