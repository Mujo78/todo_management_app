using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO
{
    public class RegistrationDTO
    {
        [Required]
        [MinLength(5, ErrorMessage = "Name must be at least 5 characters long.")]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [PasswordValidation]
        public string Password { get; set; }
    }
}
