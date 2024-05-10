using server.DTO;
using server.Models;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> Save();
        Task<User?> Register(RegistrationDTO registrationDTO);
        Task<User?> getUser(int userId);
        Task<User?> getUser(string userEmail);
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<string> CreateRefreshToken(int userId, string tokenId);
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
        bool EmailAlreadyUsed(string title);
    }
}
