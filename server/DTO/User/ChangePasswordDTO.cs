using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO.User
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "changePasswordFormValidation.passwordRequired")]
        public required string OldPassword { get; set; }

        [Required(ErrorMessage = "changePasswordFormValidation.newPasswordRequired")]
        [PasswordValidation("changePasswordFormValidation.newPasswordWeakness")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "changePasswordFormValidation.confirmPasswordRequired")]
        public required string ConfirmNewPassword { get; set; }

    }
}
