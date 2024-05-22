using AutoMapper;
using server.Exceptions;
using server.DTO.User;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;
using BCrypt.Net;

namespace server.Services
{
    public class UserService(IUserRepository repository, IAuthRepository authRepository, IMapper mapper) : IUserService
    {
        private readonly IUserRepository repository = repository;
        private readonly IAuthRepository authRepository = authRepository;
        private readonly IMapper mapper = mapper;

        public async Task<UserDTO> GetMyProfileInfo()
        {
            var userId = authRepository.GetUserId();
            
            var myInfo = await repository.GetUser(userId);
            return myInfo == null ? throw new NotFoundException("User not found.") : mapper.Map<UserDTO>(myInfo);
        }
        public async Task<bool> ChangePassword(ChangePasswordDTO changePasswordDTO)
        {
            var userId = authRepository.GetUserId();
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDTO.OldPassword, user.Password))
                throw new BadRequestException("Wrong old password.");
            if (!changePasswordDTO.NewPassword.Equals(changePasswordDTO.ConfirmNewPassword))
                throw new BadRequestException("New password and confirm password must match.");
            if (BCrypt.Net.BCrypt.Verify(changePasswordDTO.NewPassword, user.Password))
                throw new BadRequestException("New password cannot be the same as the old password.");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordDTO.NewPassword, 12);
            user.Password = hashedPassword;
            return await repository.SaveAsync();
        }

        public async Task<UserDTO> Register(RegistrationDTO registrationDTO)
        {
            bool emailTaken = repository.EmailAlreadyUsed(registrationDTO.Email);
            if (emailTaken) throw new ConflictException("Email is already used!");

            User user = new()
            {
                Name = registrationDTO.Name,
                Email = registrationDTO.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registrationDTO.Password, 12),
                CreatedAt = DateTime.Now,
            };

            await repository.CreateAsync(user);
            return mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO)
        {
            var userId = authRepository.GetUserId();
            if (!updateDTO.Id.Equals(userId)) throw new ForbidException("You are not authorize to access these resources.");

            var userFound = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");

            bool emailTaken = repository.EmailAlreadyUsed(updateDTO.Email, userId);
            if (emailTaken) throw new ConflictException("Email is already used!");

            userFound.Email = updateDTO.Email;
            userFound.Name = updateDTO.Name;

            await repository.UpdateAsync(userFound);

            return mapper.Map<UserDTO>(userFound);
        }

        public async Task<string> DeleteMyProfile()
        {
            var userId = authRepository.GetUserId();
            
            var user = await repository.GetUser(userId) ?? throw new NotFoundException("User not found.");
            return await repository.DeleteUser(user);
        }
    }
}
