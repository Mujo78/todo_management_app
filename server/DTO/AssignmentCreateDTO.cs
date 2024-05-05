using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class AssignmentCreateDTO
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        [MinLength(10)]
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date!")]
        [PastDueDateValidation]
        public DateTime DueDate { get; set; }
        public Priority Priority { get; set; } = Priority.Low;
        public Status Status { get; set; } = Status.Open;
    }
}
