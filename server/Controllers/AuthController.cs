using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Schema;
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
        [ProducesResponseType(typeof(LoginDataDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (loginDTO == null) return BadRequest("Please provide valid data to login.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var tokenToReturn = await authService.Login(loginDTO);

            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", tokenToReturn.RefreshToken, options);

            LoginDataDTO loginDataDTO = new()
            {
                AccessToken = tokenToReturn.AccessToken,
                User = tokenToReturn.User
            };
            
            return Ok(loginDataDTO);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(typeof(AccessTokenDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAccessTokenWithRefreshAction()
        {
            string accessToken = Request.Headers.Authorization!;
            string accessTokenModified = accessToken.Replace("Bearer ", string.Empty);
            string refreshToken = Request.Cookies["refreshToken"]!;
            if (string.IsNullOrEmpty(refreshToken) || string.IsNullOrEmpty(accessTokenModified)) throw new BadRequestException("Invalid token provided.");

            var tokenResponse = await authService.RefreshAccessToken(refreshToken, accessTokenModified);
            return Ok(tokenResponse);
        }

        [Authorize]
        [HttpDelete("logout")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Logout()
        {
            try
            {
                string refreshToken = Request.Cookies["refreshToken"]!;
                if (string.IsNullOrEmpty(refreshToken)) throw new BadRequestException("Invalid token provided.");

                await authService.Logout(refreshToken);
                Response.Cookies.Delete("refreshToken", new CookieOptions
                {
                    Secure = true,
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                });
                return Ok("Logged out successfully.");

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
