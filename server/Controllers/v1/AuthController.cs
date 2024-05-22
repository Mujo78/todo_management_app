using Microsoft.AspNetCore.Mvc;
using server.DTO.Auth;
using server.Exceptions;
using server.Services.IService;

namespace server.Controllers.v1
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService authService = authService;

        [HttpPost("/login")]
        [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (loginDTO == null) return BadRequest("Please provide valid data to login.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var tokenToReturn = await authService.Login(loginDTO);
            if (string.IsNullOrEmpty(tokenToReturn.RefreshToken)) throw new BadRequestException("Incorrect email or password.");

            return Ok(tokenToReturn);
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

            return Ok();

        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAccessTokenWithRefreshAction([FromBody] TokenDTO tokenDTO)
        {
            if (tokenDTO == null) return BadRequest("Invalid data provided.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var tokenResponse = await authService.RefreshAccessToken(tokenDTO);
            return Ok(tokenResponse);
        }

        [HttpPost("logout")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Logout([FromBody] TokenDTO tokenDTO)
        {
            if (tokenDTO == null || string.IsNullOrEmpty(tokenDTO.RefreshToken)) throw new BadRequestException("Invalid refresh token provided.");
            await authService.Logout(tokenDTO);
            return Ok("Logged out successfully.");
        }

    }
}
