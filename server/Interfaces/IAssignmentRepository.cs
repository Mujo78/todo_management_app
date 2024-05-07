using server.Models;

namespace server.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAssignments();
        Task<Assignment?> GetAssignmentById(int taskId);
        Task<bool> CreateAssignment(Assignment assignment);
        Task<bool> RemoveAssignment(Assignment assignment);
        Task<bool> UpdateAssignment(Assignment assignment);
        Task<bool> ExistsById(int taskId);
        Task<bool> ExistsByName(string title);
        Task<bool> Save();

    }
}
