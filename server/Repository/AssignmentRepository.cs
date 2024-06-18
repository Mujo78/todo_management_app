using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Repository.IRepository;
using System.Collections.Generic;

namespace server.Repository
{
    public class AssignmentRepository(ApplicationDBContext db) : Repository<Assignment>(db), IAssignmentRepository
    {
        private readonly ApplicationDBContext db = db;

        public async Task<IEnumerable<Assignment>> GetAllAssignments(Guid? userId, string? title, int pageNum, int limit)
        {
            IQueryable<Assignment> query = db.Assignments.Where(a => a.UserId.Equals(userId));
            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(a => a.Title.ToLower().Equals(title.ToLower()) || a.Title.Contains(title));
            }
            return await query.Skip((pageNum - 1) * limit).Take(limit).ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentById(Guid taskId, Guid? userId)
        {
            return await db.Assignments.AsNoTracking().FirstOrDefaultAsync(n => n.Id.Equals(taskId) && n.UserId.Equals(userId));
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

        public async Task<bool> RemoveAllAssignments(Guid? userId)
        {
            var assignmentsToDelete = db.Assignments.Where(assignment => assignment.UserId.Equals(userId));
            if(assignmentsToDelete.Any())
            {
                db.Assignments.RemoveRange(assignmentsToDelete);
                return await db.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<int> GetCountAssignments(Guid? userId, string? title)
        {
            IQueryable<Assignment> query = db.Assignments.Where(a => a.UserId.Equals(userId));
            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(a => a.Title.ToLower().Equals(title.ToLower()) || a.Title.Contains(title));
            }
            return await query.CountAsync();
        }
    }
}
