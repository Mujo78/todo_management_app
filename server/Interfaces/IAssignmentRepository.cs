using server.Models;

namespace server.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAssignments(Guid? userId);
        Task<Assignment?> GetAssignmentById(Guid taskId, Guid? userId);
        Task<bool> CreateAssignment(Assignment assignment);
        Task<bool> RemoveAssignment(Assignment assignment);
        Task<bool> UpdateAssignment(Assignment assignment);
        Task<bool> Save();
        bool AssignmentExists(Guid taskId, Guid? userId);
        bool AssignmentExists(string title, Guid? userId);
        bool AssignmentExists(string title, Guid taskId, Guid? userId);

    }
}
