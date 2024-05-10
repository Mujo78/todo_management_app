using AutoMapper;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;

namespace server.Controllers.v1
{
    [Route("api/users/")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserRepository repository;
        private IMapper mapper;

        public UserController(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpPost("/registration")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Registration([FromBody] RegistrationDTO registrationDTO)
        {
            if (registrationDTO == null) return BadRequest("Please provide valid data for registration.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            bool emailTaken = repository.EmailAlreadyUsed(registrationDTO.Email);

            if (emailTaken) return BadRequest("Email is already used!");

            try
            {
                registrationDTO.Password = BCrypt.Net.BCrypt.HashPassword(registrationDTO.Password, 12);
                var user = await repository.Register(registrationDTO);

                return Ok(mapper.Map<UserDTO>(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


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
                var tokenToReturn = await repository.Login(loginDTO);

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
    }
}
