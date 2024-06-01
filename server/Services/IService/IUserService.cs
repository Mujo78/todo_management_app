using server.DTO.User;
using server.Models;

namespace server.Services.IService
{
    public interface IUserService
    {
        Task<UserDTO> GetMyProfileInfo();
        Task Register(RegistrationDTO registrationDTO);
        Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO);
        Task ForgotPassword(string email);
        Task VerifyEmail(string email);
        Task ResetPassword(string token, ResetPasswordDTO resetPasswordDTO);
        Task ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task DeleteMyProfile();
    }
}
