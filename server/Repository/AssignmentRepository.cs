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

        public async Task<Assignment?> GetAssignmentById(Guid taskId)
        {
            return await db.Assignments.FirstOrDefaultAsync(n => n.Id.Equals(taskId));
        }
        public bool AssignmentExists(Guid taskId)
        {
            return db.Assignments.Any(n => n.Id.Equals(taskId));
        }

        public bool AssignmentExists(string title)
        {
            return db.Assignments.Any(n => n.Title.ToLower() == title.ToLower());
        }

        public bool AssignmentExists(string title, Guid taskId)
        {
            return db.Assignments.Any(n => n.Title.ToLower() == title.ToLower() && !n.Id.Equals(taskId));
        }

        public async Task<bool> CreateAssignment(Assignment assignment)
        {
            assignment.CreatedAt = DateTime.Now;
            assignment.UpdatedAt = DateTime.Now;
            await db.Assignments.AddAsync(assignment);
            return await Save();
        }


        public async Task<bool> RemoveAssignment(Assignment assignment)
        {
            db.Assignments.Remove(assignment);
            return await Save();
        }

        public async Task<bool> UpdateAssignment(Assignment assignment)
        {
            assignment.UpdatedAt = DateTime.Now;
            db.Assignments.Update(assignment);
            return await Save();
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0 ? true : false;
        }
    }
}
