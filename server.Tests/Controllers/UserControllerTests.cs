using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers.v1;
using server.DTO.Assignment;
using server.DTO.Auth;
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
        public async Task Registration_ShouldReturnBadRequest_WhenNameIsRequired()
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
        public async Task Registration_ShouldReturnBadRequest_WhenNoDatProvided()
        {
            RegistrationDTO? registrationDTO = null;
            
            var result = await _controller.Registration(registrationDTO!);
            
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid data for registration.", badRequestResult.Value);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnOK_WhenValidDataProvided()
        {
            var forgotPasswordDTO = new ForgotPasswordDTO
            {
                Email = "user@gmail.com"
            };

            _userServiceMock.Setup(service => service.ForgotPassword(forgotPasswordDTO.Email)).Returns(Task.CompletedTask);
            var result = await _controller.ForgotPassword(forgotPasswordDTO);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Check your email inbox to proceede with restarting your password.", isSuccess.Value);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnBadRequest_WhenEmailIsNotValid()
        {
            var forgotPasswordDTO = new ForgotPasswordDTO
            {
                Email = "user.com",
            };
            _controller.ModelState.AddModelError("Email", "The Email field is not a valid e-mail address.");

            var result = await _controller.ForgotPassword(forgotPasswordDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("Email"));
            Assert.Contains("The Email field is not a valid e-mail address.", (string[])modelState["Email"]);
        }

        [Fact]
        public async Task ForgotPassword_ShouldReturnBadRequest_WhenNoDataProvided()
        {
            ForgotPasswordDTO? forgotPasswordDTO = null;

            var result = await _controller.ForgotPassword(forgotPasswordDTO!);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid email address.", badRequestResult.Value);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenNoDataProvided()
        {
            ResetPasswordDTO? resetPasswordDTO = null;
            string token = "";

            var result = await _controller.ResetPassword(token, resetPasswordDTO!);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid data to change password.", badRequestResult.Value);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnBadRequest_WhenPasswordIsToWeak()
        {
            var resetPasswordDTO = new ResetPasswordDTO
            {
                NewPassword = "string",
                ConfirmNewPassword = "string",
            };
            string token = "";
            string errorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";
            _controller.ModelState.AddModelError("New Password", errorMessage);

            var result = await _controller.ResetPassword(token, resetPasswordDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("New Password"));
            Assert.Contains(errorMessage, (string[])modelState["New Password"]);
        }

        [Fact]
        public async Task ResetPassword_ShouldReturnOK_WhenValidDataProvided()
        {
            var resetPasswordDTO = new ResetPasswordDTO
            {
               NewPassword = "Password&12345",
               ConfirmNewPassword = "Password&12345"
            };
            string token = "";

            _userServiceMock.Setup(service => service.ResetPassword(token, resetPasswordDTO)).Returns(Task.CompletedTask);
            var result = await _controller.ResetPassword(token, resetPasswordDTO);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Password successfully changed.", isSuccess.Value);
        }

        [Fact]
        public async Task GetMyInfo_ShouldBeSuccess()
        {

            var userDTO = new UserDTO
            {
                Name = "Test User One",
                EmailConfirmed = true,
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                Email = "user@gmail.com",
            };

            var assignmentCountDTO = new AssignmentCountDTO
            {
                Total = 3,
                Completed = 1,
                Failed = 1,
                Open = 1
            };

            var myInfoDTO = new MyInfoDTO
            {
                AssignmentCount = assignmentCountDTO,
                Average = 1,
                User = userDTO
            };

            _userServiceMock.Setup(service => service.GetMyProfileInfo()).ReturnsAsync(myInfoDTO);

            var result = await _controller.GetMyInfo();

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<MyInfoDTO>(isSuccess.Value);
            Assert.Equal(myInfoDTO.User.Id, value.User.Id);
            Assert.Equal(myInfoDTO.AssignmentCount.Total, value.AssignmentCount.Total);
            Assert.Equal(myInfoDTO.Average, value.Average);
        }

        [Fact]
        public async Task UpdateMyProfile_ShouldReturnBadRequest_WhenNoDataProvided()
        {
            UserUpdateDTO? userUpdateDTO = null;

            var result = await _controller.UpdateMyProfile(userUpdateDTO!);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid user data to update your profile.", badRequestResult.Value);
        }


        [Fact]
        public async Task UpdateMyProfile_ShouldReturnBadRequest_EmailIsNotProvided()
        {
            var userUpdateDTO = new UserUpdateDTO
            {
                Name = "Test User One",
                EmailConfirmed = true,
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                Email = "",
            };
            _controller.ModelState.AddModelError("Email", "The Email field is required.");

            var result = await _controller.UpdateMyProfile(userUpdateDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("Email"));
            Assert.Contains("The Email field is required.", (string[])modelState["Email"]);
        }

        [Fact]
        public async Task UpdateMyProfile_ShouldReturnOK_WhenValidDataProvided()
        {
            var userUpdateDTO = new UserUpdateDTO
            {
                Name = "Test User One",
                EmailConfirmed = true,
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                Email = "user@gmail.com",
            };

            var expectedUserDTO = new UserDTO
            {
                Name = userUpdateDTO.Name,
                EmailConfirmed = userUpdateDTO.EmailConfirmed,
                Id = userUpdateDTO.Id,
                CreatedAt = userUpdateDTO.CreatedAt,
                Email = userUpdateDTO.Email,
            };

            _userServiceMock.Setup(service => service.UpdateUser(userUpdateDTO)).ReturnsAsync(expectedUserDTO);
            var result = await _controller.UpdateMyProfile(userUpdateDTO);

            var resultSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<UserDTO>(resultSuccess.Value);

            Assert.Equal(expectedUserDTO.Id, value.Id);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnOK_WhenValidDataProvided()
        {
            var changePasswordDTO = new ChangePasswordDTO
            {
                OldPassword = "Password&1234",
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            

            _userServiceMock.Setup(service => service.ChangePassword(changePasswordDTO)).Returns(Task.CompletedTask);
            var result = await _controller.ChangePassword(changePasswordDTO);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Password successfully changed.", isSuccess.Value);
        }

        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_WhenOldPasswordIsRequired()
        {
            var changePasswordDTO = new ChangePasswordDTO
            {
                OldPassword = "",
                NewPassword = "Password&12345",
                ConfirmNewPassword = "Password&12345"
            };
            _controller.ModelState.AddModelError("OldPassword", "Old password is required.");

            var result = await _controller.ChangePassword(changePasswordDTO);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);

            Assert.True(modelState.ContainsKey("OldPassword"));
            Assert.Contains("Old password is required.", (string[])modelState["OldPassword"]);
        }


        [Fact]
        public async Task ChangePassword_ShouldReturnBadRequest_WhenNoDataProvided()
        {
            ChangePasswordDTO? changePasswordDTO = null;

            var result = await _controller.ChangePassword(changePasswordDTO!);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Please provide valid data for changing password.", badRequestResult.Value);
        }

        [Fact]
        public async Task VerifyEmail_ShouldReturnOK_WhenValidDataProvided()
        {
            string token = "";

            _userServiceMock.Setup(service => service.VerifyEmail(token)).Returns(Task.CompletedTask);
            var result = await _controller.VerifyEmail(token);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Successfully verified email address.", isSuccess.Value);
        }

    }
}
