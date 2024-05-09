using server.DTO;
using server.Models;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        bool EmailAlreadyUsed(string title);
        public Task<bool> Save();
        Task<User?> Register(RegistrationDTO registrationDTO);
        Task<User?> getUserById(int userId);
        Task<TokenDTO> Login(LoginDTO loginDTO);
    }
}
