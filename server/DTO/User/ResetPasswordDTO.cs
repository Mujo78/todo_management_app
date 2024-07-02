using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO.User
{
    public class ResetPasswordDTO
    {
        [Required(ErrorMessage = "The New Password field is required.")]
        [PasswordValidation]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "The Confirm New Password field is required.")]
        public required string ConfirmNewPassword { get; set; }

    }
}
