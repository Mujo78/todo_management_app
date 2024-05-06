using server.Models;

namespace server.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAssignments();
        Task<Assignment?> GetAssignmentById(int taskId);
        Task CreateAssignment(Assignment assignment);
        Task<bool> RemoveAssignment(Assignment assignment);
        Task<Assignment> UpdateAssignment(Assignment assignment);
        Task<bool> AssignmentExists(int? taskId = null, string? title = null);
    }
}
