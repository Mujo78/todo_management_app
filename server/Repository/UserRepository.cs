using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Repository.IRepository;

namespace server.Repository
{
    public class UserRepository(ApplicationDBContext db) : Repository<User>(db), IUserRepository
    {
        private readonly ApplicationDBContext db = db;

        public bool EmailAlreadyUsed(string email)
        {
            return db.Users.Any(n => n.Email.ToLower().Equals(email.ToLower()));
        }

        public bool EmailAlreadyUsed(string email, Guid? userId)
        {
            return db.Users.Any(n => n.Email.ToLower().Equals(email.ToLower()) && !n.Id.Equals(userId));
        }

        public async Task<User?> GetUser(Guid? userId)
        {
            return await db.Users.FirstOrDefaultAsync(n => n.Id.Equals(userId));
        }

       public async Task<string> DeleteUser(User user)
        {
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var assignmentsToDelete = db.Assignments.Where(assignment => assignment.UserId.Equals(user.Id));
                db.Assignments.RemoveRange(assignmentsToDelete);
                
                db.Users.Remove(user);

                await db.SaveChangesAsync();
                await transaction.CommitAsync();

                return "User deleted succesfully.";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ex.Message;
            }

        }

    }
}
