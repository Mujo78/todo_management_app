using server.Models;

namespace server.Repository.IRepository
{
    public interface IAssignmentRepository: IRepository<Assignment>
    {
        Task<IEnumerable<Assignment>> GetAllAssignments(Guid? userId, string? title, int pageNum, int limit);
        Task<IEnumerable<Assignment>> GetAssignmentsById(List<Guid> assignmentsIds, Guid? userId);
        Task<Assignment?> GetTrackingAssignmentById(Guid taskId, Guid? userId);
        Task<int> GetCountAssignments(Guid? userId, string? title);
        Task<Assignment?> GetAssignmentById(Guid taskId, Guid? userId);
        Task RemoveAllAssignments(Guid? userId);
        Task RemoveSelectedAssignments(IEnumerable<Assignment> assignments);
        bool AssignmentExists(Guid taskId, Guid? userId);
        bool AssignmentExists(string title, Guid? userId);
        bool AssignmentExists(string title, Guid taskId, Guid? userId);
        Task SeedTestingDatabase();
    }
}
