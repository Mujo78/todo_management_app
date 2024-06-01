using server.Utils.Enums;

namespace server.DTO.Assignment
{
    public class AssignmentDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public Priority Priority { get; set; } = Priority.Low;
        public Status Status { get; set; } = Status.Open;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
