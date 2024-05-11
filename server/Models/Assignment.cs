using server.Utils.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("assignments")]
    public class Assignment
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("userId")]
        public Guid UserId { get; set; }
        public string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime DueDate { get; set; }

        public Priority Priority { get; set; } = Priority.Low;

        public Status Status { get; set; } = Status.Open;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User User { get; set; }

    }
}
