using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO.Assignment
{
    public class AssignmentCreateDTO
    {
        [Required(ErrorMessage = "taskFormService.titleRequired")]
        [MinLength(10, ErrorMessage = "taskFormService.titleLength")]
        public required string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "taskFormService.dueDateRequired")]
        [DataType(DataType.DateTime, ErrorMessage = "taskFormService.invalidDate")]
        [PastDueDateValidation]
        public DateTime DueDate { get; set; }
        [PriorityValidation]
        public Priority Priority { get; set; } = Priority.Low;
        [StatusValidation]
        public Status Status { get; set; } = Status.Open;
    }
}
