using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("users")]
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        
        [Required]
        [EmailAddress]
        //[EmailUnique]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        public bool EmailConfirmed { get; set; } = false;

    }
}
