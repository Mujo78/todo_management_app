using System.ComponentModel.DataAnnotations;

namespace server.DTO.User
{
    public class UserUpdateDTO
    {
        [Required]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "editProfileFormValidation.nameRequired")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "editProfileFormValidation.emailRequired")]
        [EmailAddress(ErrorMessage = "editProfileFormValidation.emailValid")]
        public required string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
