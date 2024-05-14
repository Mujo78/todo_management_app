using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;
using server.Models;

namespace server.Repository
{
    public class AssignmentRepository(ApplicationDBContext db) : IAssignmentRepository
    {

        private readonly ApplicationDBContext db = db;

        public async Task<IEnumerable<Assignment>> GetAllAssignments(Guid? userId)
        {
            return await db.Assignments.Where(a => a.UserId == userId).ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentById(Guid taskId, Guid? userId)
        {
            return await db.Assignments.FirstOrDefaultAsync(n => n.Id.Equals(taskId) && n.UserId.Equals(userId));
        }
        public bool AssignmentExists(Guid taskId, Guid? userId)
        {
            return db.Assignments.Any(n => n.Id.Equals(taskId) && n.UserId.Equals(userId));
        }

        public bool AssignmentExists(string title, Guid? userId)
        {
            return db.Assignments.Any(n => n.Title.ToLower().Equals(title.ToLower()) && n.UserId.Equals(userId));
        }

        public bool AssignmentExists(string title, Guid taskId, Guid? userId)
        {
            return db.Assignments.Any(n => n.Title.ToLower().Equals(title.ToLower()) && !n.Id.Equals(taskId) && n.UserId.Equals(userId));
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

        public async Task<bool> RemoveAllAssignments(Guid? userId)
        {
            if (userId == null) return false;

            var assignmentsToDelete = db.Assignments.Where(assignment => assignment.UserId.Equals(userId));
            if(assignmentsToDelete.Any())
            {
                db.Assignments.RemoveRange(assignmentsToDelete);
                return await Save();
            }

            return false;
        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0;
        }

    }
}
