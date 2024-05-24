namespace server.Services.IService
{
    public interface ITokenCleanupService
    {
        Task CleanupInvalidTokens();
    }
}
