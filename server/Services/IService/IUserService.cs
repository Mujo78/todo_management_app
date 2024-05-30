using server.DTO.User;

namespace server.Services.IService
{
    public interface IUserService
    {
        Task<UserDTO> GetMyProfileInfo();
        Task<bool> Register(RegistrationDTO registrationDTO);
        Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO);
        Task ForgotPassword(string email);
        Task VerifyEmail(string email);
        Task<bool> ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task<string> DeleteMyProfile();
    }
}
