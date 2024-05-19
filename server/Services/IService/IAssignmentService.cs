using server.DTO.Assignment;
using server.Models;

namespace server.Services.IService
{
    public interface IAssignmentService
    {
        Task<IEnumerable<AssignmentDTO>> GetAllAssignmentsAsync();
        Task<AssignmentDTO?> GetAssignmentAsync(Guid taskId);
        Task<bool> CreateAssignmentAsync(Assignment assignment);
        Task<bool> UpdateAssignmentAsync(Assignment assignment);
        Task<bool> DeleteAssignmentAsync(Assignment assignment);
        Task<bool> DeleteAllAssignmentsAsync();
    }
}
