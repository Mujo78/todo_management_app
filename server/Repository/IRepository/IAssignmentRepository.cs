using server.Models;

namespace server.Repository.IRepository
{
    public interface IAssignmentRepository: IRepository<Assignment>
    {
        Task<IEnumerable<Assignment>> GetAllAssignments(Guid? userId);
        Task<Assignment?> GetAssignmentById(Guid taskId, Guid? userId);
        Task<bool> RemoveAllAssignments(Guid? userId);
        bool AssignmentExists(Guid taskId, Guid userId);
        bool AssignmentExists(string title, Guid userId);
        bool AssignmentExists(string title, Guid taskId, Guid userId);

    }
}
