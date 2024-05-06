using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;
using System.Threading.Tasks;

namespace server.Repository
{
    public class AssignmentRepository : IAssignmentRepository
    {

        private readonly ApplicationDBContext db;
        public AssignmentRepository(ApplicationDBContext db)
        {
            this.db = db;
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignments()
        {
            return await db.Assignments.ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentById(int taskId)
        {
            return await db.Assignments.FirstOrDefaultAsync(n => n.Id == taskId);
        }
        public async Task<bool> AssignmentExists(int? taskId, string? title)
        {
            return await db.Assignments.AnyAsync(n => n.Id == taskId || n.Title == title);
        }

        public async Task CreateAssignment(Assignment assignment)
        {
            await db.Assignments.AddAsync(assignment);
            await db.SaveChangesAsync();
        }


        public async Task<bool> RemoveAssignment(Assignment assignment)
        {
            db.Assignments.Remove(assignment);
            var saved = await db.SaveChangesAsync();
            return saved > 0 ? true : false;
        }

        public async Task<Assignment> UpdateAssignment(Assignment assignment)
        {
            db.Assignments.Update(assignment);
            await db.SaveChangesAsync();
            return assignment;
        }
    }
}
