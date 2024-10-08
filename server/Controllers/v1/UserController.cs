﻿using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO.Auth;
using server.DTO.User;
using server.Filters;
using server.Services;
using server.Services.IService;
using server.Utils.Enums;

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
            if (registrationDTO == null) return BadRequest("registrationService.registrationValidData");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.Register(registrationDTO);
            return Ok("registrationService.successMessage");
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            if (forgotPasswordDTO == null) return BadRequest("forgotPasswordService.forgotPasswordValidData");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.ForgotPassword(forgotPasswordDTO.Email);
            return Ok("forgotPasswordService.successMessage");
        }

        [HttpPatch("reset-password/{token}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ResetPassword([FromRoute] string token, [FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (resetPasswordDTO == null) return BadRequest("resetPasswordService.resetPasswordValidData");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.ResetPassword(token, resetPasswordDTO);
            return Ok("resetPasswordService.successMessage");
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
            if (updateDTO == null) return BadRequest("editProfileService.editProfileValidData");
            if (!ModelState.IsValid) return BadRequest(ModelState);

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
            if (changePasswordDTO == null) return BadRequest("changePasswordService.changePasswordValidData");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await userService.ChangePassword(changePasswordDTO);
            return Ok("changePasswordService.successMessage");
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
            try
            {
                await userService.DeleteMyProfile();
                Response.Cookies.Delete("refreshToken", new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                });
                Response.Cookies.Delete("checkToken", new CookieOptions
                {
                    Secure = true,
                    SameSite = SameSiteMode.None
                });
                return Ok("deleteProfileService.successMessage");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPatch("verify/{token}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> VerifyEmail([FromRoute] string token)
        {
            await userService.VerifyEmail(token);
            return Ok("verifyEmailService");
        }

        [AllowAnonymous]
        [HttpPost("/seed-database-user-token/{tokenType}")]
        [TypeFilter(typeof(TestingOnly))]
        [ApiExplorerSettings(IgnoreApi = true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task SeedDatabaseUserTokens([FromRoute] TokenType tokenType)
        {
            await userService.SeedDatabaseWithUserToken(tokenType);
        }

        [AllowAnonymous]
        [HttpPost("/seed-database-user")]
        [TypeFilter(typeof(TestingOnly))]
        [ApiExplorerSettings(IgnoreApi = true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task SeedDatabaseUser()
        {
            await userService.SeedDatabaseWithUser();
        }
    }
}
