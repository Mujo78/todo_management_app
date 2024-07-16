using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers.v1;
using server.DTO.User;
using server.Services.IService;

namespace server.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();
            _controller = new UserController(_userServiceMock.Object);
        }

        [Fact]
        public async Task Registration_ShouldReturnOk_WhenDataIsValid()
        {
            var registrationDTO = new RegistrationDTO
            {
                Email = "user@gmail.com",
                Name = "Test User One",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };

            _userServiceMock.Setup(service => service.Register(registrationDTO)).Returns(Task.CompletedTask);

            var result = await _controller.Registration(registrationDTO);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Please check your inbox, for verification email.", isSuccess.Value);
        }

        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenNoDatProvided()
        {
            var registrationDTO = new RegistrationDTO
            {
                Email = "user@gmail.com",
                Name = "",
                Password = "Password&12345",
                ConfirmPassword = "Password&12345"
            };
            _controller.ModelState.AddModelError("Name", "The field Name is required.");

            var result = await _controller.Registration(registrationDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("Name"));
            Assert.Contains("The field Name is required.", (string[])modelState["Name"]);
        }

        [Fact]
        public async Task Registration_ShouldReturnBadRequest_WhenNameIsRequired()
        {
            RegistrationDTO? registrationDTO = null;
            
            var result = await _controller.Registration(registrationDTO);
            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid data for registration.", badRequestResult.Value);
        }
    }
}
