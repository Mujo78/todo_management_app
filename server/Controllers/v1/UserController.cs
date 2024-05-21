﻿using AutoMapper;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO.User;
using server.Repository.IRepository;
using server.Services.IService;

namespace server.Controllers.v1
{
    [Route("api/users/")]
    [ApiController]
    public class UserController(IUserService userService, IUserRepository repository, IAuthRepository authRepository) : ControllerBase
    {

        private readonly IUserService userService = userService;
        private readonly IUserRepository repository = repository;
        private readonly IAuthRepository authRepository = authRepository;

        [HttpPost("/registration")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Registration([FromBody] RegistrationDTO registrationDTO)
        {
            if (registrationDTO == null) return BadRequest("Please provide valid data for registration.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await userService.Register(registrationDTO);
            return Ok(user);
        }

        [Authorize]
        [HttpGet("my-info")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
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
            var userId = authRepository.GetUserId();

            var isSuccess = await repository.DeleteUser(userId);
            if (isSuccess.Contains("successfully"))
            {
                return Ok(isSuccess);
            }

            return BadRequest(isSuccess);
        }
    }
}
