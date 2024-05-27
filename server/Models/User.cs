using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool EmailConfirmed { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public RefreshToken RefreshToken { get; set; }
        public ICollection<UserToken> UserTokens { get; set; }
    }
}
