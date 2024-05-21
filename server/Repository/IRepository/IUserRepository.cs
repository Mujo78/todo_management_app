using server.DTO.User;
using server.Models;

namespace server.Repository.IRepository
{
    public interface IUserRepository: IRepository<User>
    {
        Task<User?> GetUser(Guid? userId);
        Task<User?> GetUser(string userEmail);
        Task<string> DeleteUser(Guid? userId);
        bool EmailAlreadyUsed(string email);
        bool EmailAlreadyUsed(string email, Guid? userId);
    }
}
