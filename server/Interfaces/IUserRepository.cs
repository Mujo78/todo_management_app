using server.DTO;
using server.Models;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> Register(RegistrationDTO registrationDTO);
        Task<User?> GetUser(Guid? userId);
        Task<User?> GetUser(string userEmail);
        Task<bool> UpdateUser(User user);
        Task<string> DeleteUser(Guid? userId);
        public Task<bool> Save();
        bool EmailAlreadyUsed(string email);
        bool EmailAlreadyUsed(string email, Guid? userId);
    }
}
