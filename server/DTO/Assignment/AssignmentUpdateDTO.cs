using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO.Assignment
{
    public class AssignmentUpdateDTO
    {
        [Required(ErrorMessage = "editTaskService.idRequired")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "editTaskService.userIdRequired")]
        public Guid UserId { get; set; }
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
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
