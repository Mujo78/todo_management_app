using System.ComponentModel.DataAnnotations;

namespace server.DTO.Auth
{
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
    }
}
