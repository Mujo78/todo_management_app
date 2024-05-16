using System.ComponentModel.DataAnnotations;

namespace server.DTO.Auth
{
    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
