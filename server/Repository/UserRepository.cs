using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Interfaces;

namespace server.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext db;
        public UserRepository(ApplicationDBContext db)
        {
            this.db = db;
        }

        public async Task<bool> EmailAlreadyUsed(string email)
        {
            return await db.Users.AnyAsync(n => n.Email.ToLower() == email.ToLower());
        }
    }
}
