using System.ComponentModel.DataAnnotations;

namespace server.DTO.User
{
    public class UserUpdateDTO
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
