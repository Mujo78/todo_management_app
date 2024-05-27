using server.Utils.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("user_tokens")]
    public class UserToken
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Token { get; set; }
        public TokenType TokenType { get; set; }
        public DateTime ExpiresAt { get; set; }

        public User User { get; set; }
    }
}
