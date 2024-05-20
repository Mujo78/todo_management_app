﻿using server.DTO.Assignment;
using server.Models;

namespace server.Services.IService
{
    public interface IAssignmentService
    {
        Task<IEnumerable<AssignmentDTO>> GetAllAssignmentsAsync();
        Task<AssignmentDTO?> GetAssignmentAsync(Guid taskId);
        Task<AssignmentDTO> CreateAssignmentAsync(AssignmentCreateDTO assignment);
        Task<AssignmentDTO> UpdateAssignmentAsync(Guid taskId, AssignmentUpdateDTO updateDTO);
        Task<bool> DeleteAssignmentAsync(Guid taskId);
        Task<bool> DeleteAllAssignmentsAsync();
    }
}
