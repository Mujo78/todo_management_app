using System.ComponentModel.DataAnnotations;

namespace server.DTO.Auth
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "loginFormValidation.emailRequired")]
        [EmailAddress(ErrorMessage = "loginFormValidation.emailValid")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "loginFormValidation.passwordRequired")]
        public required string Password { get; set; }
    }
}
