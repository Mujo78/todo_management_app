using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO.User
{
    public class RegistrationDTO
    {
        [Required]
        [MinLength(5, ErrorMessage = "Name must be at least 5 characters long.")]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [PasswordValidation]
        public required string Password { get; set; }

        [Required(ErrorMessage = "The Confirm Password field is required.")]
        public required string ConfirmPassword { get; set; }
    }
}
