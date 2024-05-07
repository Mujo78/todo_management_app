namespace server.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> EmailAlreadyUsed(string title);
    }
}
