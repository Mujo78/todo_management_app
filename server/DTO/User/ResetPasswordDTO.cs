using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO.User
{
    public class ResetPasswordDTO
    {
        [Required(ErrorMessage = "resetPasswordFormValidation.passwordRequired")]
        [PasswordValidation("resetPasswordFormValidation.passwordWeakness")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "resetPasswordFormValidation.confirmNewPasswordRequired")]
        public required string ConfirmNewPassword { get; set; }

    }
}
