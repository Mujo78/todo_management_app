using server.DTO.User;
using server.Models;

namespace server.Services.IService
{
    public interface IUserService
    {
        Task<UserDTO> Register(RegistrationDTO registrationDTO);
        Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO);
        Task<bool> ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task<UserDTO> GetMyProfileInfo();
    }
}
