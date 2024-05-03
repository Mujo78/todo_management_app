using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("tasks")]
    public class Task
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("userId")]
        public int UserId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date!")]
        [PastDueDateValidation]
        public DateTime DueDate { get; set; }

        public Priority Priority { get; set; } = Priority.Low;

        public Status Status { get; set; } = Status.Open;

        public User User { get; set; }

    }
}
