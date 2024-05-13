using AutoMapper;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;
using server.Models;

namespace server.Controllers.v1
{
    [Route("api/users/")]
    [ApiController]
    public class UserController(IUserRepository repository, IAuthRepository authRepository,  IMapper mapper) : ControllerBase
    {
        private readonly IUserRepository repository = repository;
        private readonly IAuthRepository authRepository = authRepository;
        private readonly IMapper mapper = mapper;

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

        [Authorize]
        [HttpGet("my-info")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> GetMyInfo()
        {
            var userId = authRepository.GetUserId();
            
            var user = await repository.GetUser(userId);
            if (user == null) return NotFound("User not found.");

            return Ok(mapper.Map<UserDTO>(user));
        }

        [Authorize]
        [HttpPut]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult> UpdateMyProfile([FromBody] UserUpdateDTO updateDTO)
        {
            var userId = authRepository.GetUserId();

            if (updateDTO == null) return BadRequest();
            if (!updateDTO.Id.Equals(userId)) return Forbid();

            if(!ModelState.IsValid) return BadRequest(ModelState);

            var userFound = await repository.GetUser(userId);
            if (userFound == null) return NotFound("User not found.");

            bool emailTaken = repository.EmailAlreadyUsed(updateDTO.Email, userId);
            if (emailTaken) return BadRequest("Email is already used!");

            userFound.Email = updateDTO.Email;
            userFound.Name = updateDTO.Name;

            bool isSuccess = await repository.UpdateUser(userFound);
            if (!isSuccess) return BadRequest("Profile is not updated.");

            return Ok(mapper.Map<UserDTO>(userFound));
        }
    }
}
