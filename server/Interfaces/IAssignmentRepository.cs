using server.Models;

namespace server.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<IEnumerable<Assignment>> GetAllAssignments();
        Task<Assignment> GetAssignmentById(int taskId);
        Task CreateAssignment(Assignment assignment);
        Task RemoveAssignment(Assignment assignment);
        Task UpdateAssignment(Assignment assignment);
        Task<bool> AssignmentExists(int taskId);
        Task<bool> AssignmentWithSpecificTitleExists(string title);
    }
}
