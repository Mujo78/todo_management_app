using server.Models;

namespace server.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAssignments();
        Task<Assignment?> GetAssignmentById(Guid taskId);
        Task<bool> CreateAssignment(Assignment assignment);
        Task<bool> RemoveAssignment(Assignment assignment);
        Task<bool> UpdateAssignment(Assignment assignment);
        Task<bool> Save();
        bool AssignmentExists(Guid taskId);
        bool AssignmentExists(string title);
        bool AssignmentExists(string title, Guid taskId);

    }
}
