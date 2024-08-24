using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO.User
{
    public class RegistrationDTO
    {
        [Required(ErrorMessage = "signupFormValidation.nameRequired")]
        [MinLength(5, ErrorMessage = "signupFormValidation.nameLength")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "signupFormValidation.emailRequired")]
        [EmailAddress(ErrorMessage = "signupFormValidation.emailValid")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "signupFormValidation.passwordRequired")]
        [MinLength(8, ErrorMessage = "signupFormValidation.passwordLength")]
        [PasswordValidation("signupFormValidation.passwordWeakness")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "signupFormValidation.confirmPasswordRequired")]
        public required string ConfirmPassword { get; set; }
    }
}
