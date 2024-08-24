using System.ComponentModel.DataAnnotations;

namespace server.DTO.Auth
{
    public class ForgotPasswordDTO
    {
        [Required(ErrorMessage = "forgotPasswordFormValidation.emailRequired")]
        [EmailAddress(ErrorMessage = "forgotPasswordFormValidation.emailValid")]
        public required string Email { get; set; }
    }
}
