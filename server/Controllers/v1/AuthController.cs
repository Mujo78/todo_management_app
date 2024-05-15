using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;

namespace server.Controllers.v1
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(IAuthRepository authRepository) : ControllerBase
    {
        private readonly IAuthRepository authRepository = authRepository;

        [HttpPost("/login")]
        [ProducesResponseType(typeof(TokenDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (loginDTO == null) return BadRequest("Please provide valid data to login.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var tokenToReturn = await authRepository.Login(loginDTO);

                if (string.IsNullOrEmpty(tokenToReturn.AccessToken))
                {
                    return BadRequest("Incorrect email or password.");
                }

                return Ok(tokenToReturn);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordDTO forgotPasswordDTO)
        {
            if(forgotPasswordDTO == null) return BadRequest("Please provide valid email address.");
            if(!ModelState.IsValid) return BadRequest(ModelState);

            return Ok();
            
        }
    }
}
