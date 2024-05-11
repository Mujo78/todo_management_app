﻿using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.DTO
{
    public class AssignmentUpdateDTO
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        [MinLength(10, ErrorMessage = "Title must be at least 10 characters long.")]
        public string Title { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.DateTime, ErrorMessage = "Invalid date!")]
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
