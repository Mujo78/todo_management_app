using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class UserUpdateDTO
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set;}
        [Required]
        [EmailAddress]
        public string Email { get; set;}
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
