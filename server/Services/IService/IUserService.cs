using server.DTO.User;

namespace server.Services.IService
{
    public interface IUserService
    {
        Task<MyInfoDTO> GetMyProfileInfo();
        Task Register(RegistrationDTO registrationDTO);
        Task<UserDTO> UpdateUser(UserUpdateDTO updateDTO);
        Task ForgotPassword(string email);
        Task VerifyEmail(string email);
        Task ResetPassword(string token, ResetPasswordDTO resetPasswordDTO);
        Task ChangePassword(ChangePasswordDTO changePasswordDTO);
        Task DeleteMyProfile();
        Task SeedDatabaseWithUser();
    }
}
