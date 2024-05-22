using server.DTO.User;

namespace server.Services.IService
{
    public interface IUserService
    {
        Task<UserDTO> GetMyProfileInfo();
        Task<UserDTO> Register(RegistrationDTO registrationDTO);
        Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO);
        Task<bool> ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task<string> DeleteMyProfile();
    }
}
