using server.Interfaces;
using server.Models;

namespace server.Repository
{
    public class AssignmentRepository : IAssignmentRepository
    {
        public async Task<bool> AssignmentExists(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> AssignmentWithSpecificTitleExists(string title)
        {
            throw new NotImplementedException();
        }

        public async Task CreateAssignment(Assignment assignment)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignments()
        {
            throw new NotImplementedException();
        }

        public async Task<Assignment> GetAssignmentById(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveAssignment(Assignment assignment)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateAssignment(Assignment assignment)
        {
            throw new NotImplementedException();
        }
    }
}
