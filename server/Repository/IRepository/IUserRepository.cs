using server.Models;

namespace server.Repository.IRepository
{
    public interface IUserRepository: IRepository<User>
    {
        Task CreateUserAsync(User user, string verificationToken);
        Task<User?> GetUser(Guid? userId);
        Task<UserToken?> GetUserToken(string token);
        Task VerifyEmailAddress(User user, UserToken token);
        Task DeleteUser(User user);
        bool EmailAlreadyUsed(string email);
        bool EmailAlreadyUsed(string email, Guid? userId);
        bool IsUserTokenValid(UserToken token);
    }
}
