using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO.Auth;
using server.DTO.User;
using server.Services.IService;

namespace server.Controllers.v1
{
    [Route("api/v{version:apiVersion}/users/")]
    [ApiVersion("1.0")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService userService = userService;

        [HttpPost("registration")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Registration([FromBody] RegistrationDTO registrationDTO)
        {
            if (registrationDTO == null) return BadRequest("Please provide valid data for registration.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.Register(registrationDTO);
            return Ok("Please check your inbox, for verification email.");
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            if (forgotPasswordDTO == null) return BadRequest("Please provide valid email address.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.ForgotPassword(forgotPasswordDTO.Email);
            return Ok("Check your email inbox to proceede with restarting your password.");
        }

        [HttpPatch("reset-password/{token}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ResetPassword([FromRoute] string token, [FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (resetPasswordDTO == null) return BadRequest("Please provide valid data to change password.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.ResetPassword(token, resetPasswordDTO);
            return Ok("Password successfully changed.");
        }

        [Authorize]
        [HttpGet("my-info")]
        [ProducesResponseType(typeof(MyInfoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> GetMyInfo()
        {
            var user = await userService.GetMyProfileInfo();
            return Ok(user);
        }

        [Authorize]
        [HttpPut]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> UpdateMyProfile([FromBody] UserUpdateDTO updateDTO)
        {
            if (updateDTO == null) return BadRequest();
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var user = await userService.UpdateUser(updateDTO);
            return Ok(user);
        }

        [Authorize]
        [HttpPost("change-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            if (changePasswordDTO == null) return BadRequest("Please provide valid data for changing password.");
            if (!ModelState.IsValid) return BadRequest(ModelState);
           
            await userService.ChangePassword(changePasswordDTO);
            return Ok("Password successfully changed.");
        }

        [Authorize]
        [HttpDelete]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> DeleteMyProfile()
        {
            await userService.DeleteMyProfile();
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.None,
            });
            return Ok("Profile succesfully deleted.");
        }

        [HttpPatch("verify/{token}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> VerifyEmail([FromRoute] string token)
        {
            await userService.VerifyEmail(token);
            return Ok("Successfully verified email address.");
        }
    }
}
