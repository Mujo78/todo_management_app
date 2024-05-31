using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO.User
{
    public class ResetPasswordDTO
    {
        [Required(ErrorMessage = "New password is required.")]
        [PasswordValidation]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm new password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [PasswordValidation]
        public string ConfirmNewPassword { get; set; }

    }
}
