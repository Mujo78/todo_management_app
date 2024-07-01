using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO.User
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "Old password is required.")]
        public required string OldPassword { get; set; }

        [Required(ErrorMessage = "New password is required.")]
        [PasswordValidation]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm new password is required.")]
        [PasswordValidation]
        public required string ConfirmNewPassword { get; set; }

    }
}
