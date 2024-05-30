using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using server.DTO.Auth;
using server.Exceptions;
using server.Services.IService;

namespace server.Controllers
{
    [Route("api/auth")]
    [ApiVersionNeutral]
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
            return Ok(tokenToReturn);
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
            if (tokenDTO == null || string.IsNullOrEmpty(tokenDTO.RefreshToken)) throw new BadRequestException("Invalid token provided.");
            await authService.Logout(tokenDTO);
            return Ok("Logged out successfully.");
        }

    }
}
