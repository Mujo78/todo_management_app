using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTO;
using server.Interfaces;
using server.Models;

namespace server.Repository
{
    public class UserRepository(ApplicationDBContext db) : IUserRepository
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
            if(userId == null) { return  null; }

            var user = await db.Users.FirstAsync(n => n.Id.Equals(userId));
            return user;
        }

        public async Task<User?> GetUser(string userEmail)
        {
            var user = await db.Users.FirstAsync(n => n.Email.Equals(userEmail));

            return user;
        }

        public async Task<User?> Register(RegistrationDTO registrationDTO)
        {
            User user = new()
            {
                Name = registrationDTO.Name,
                Email = registrationDTO.Email,
                Password = registrationDTO.Password,
                CreatedAt = DateTime.Now,
            };

            await db.Users.AddAsync(user);
            bool success = await Save();

            return success ? user : null;
        }

        public async Task<bool> UpdateUser(User user)
        {
            db.Users.Update(user);
            return await Save();
        }
        public async Task<string> DeleteUser(Guid? userId)
        {
            using var transaction = db.Database.BeginTransaction();

            try
            {
                var assignmentsToDelete = db.Assignments.Where(assignment => assignment.UserId.Equals(userId));
                db.Assignments.RemoveRange(assignmentsToDelete);

                var userToDelete = await db.Users.FindAsync(userId);
                db.Users.Remove(userToDelete);

                await db.SaveChangesAsync();
                await transaction.CommitAsync();

                return "User deleted succesfully.";
            }
            catch(Exception ex)
            {
                await transaction.RollbackAsync();
                return ex.Message;
            }

        }

        public async Task<bool> Save()
        {
            var saved = await db.SaveChangesAsync();
            return saved > 0;
        }

    }
}
