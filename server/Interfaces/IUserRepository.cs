using server.DTO;
using server.Models;

namespace server.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> Register(RegistrationDTO registrationDTO);
        Task<User?> GetUser(Guid userId);
        Task<User?> GetUser(string userEmail);
        Task<TokenDTO> Login(LoginDTO loginDTO);
        Task<string> CreateRefreshToken(Guid userId, string tokenId);
        public Task<bool> Save();
        Guid? GetUserId();
        string CreateAccessToken(User user, string tokenId);
        string GenerateRefreshToken();
        bool EmailAlreadyUsed(string title);
    }
}
