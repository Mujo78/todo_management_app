using server.Models;

namespace server.Repository.IRepository
{
    public interface IUserRepository: IRepository<User>
    {
        Task<User?> GetUser(Guid? userId);
        Task<string> DeleteUser(User user);
        bool EmailAlreadyUsed(string email);
        bool EmailAlreadyUsed(string email, Guid? userId);
    }
}
