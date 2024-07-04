namespace server.Services.IService
{
    public interface IBackgroundJobService
    {
        Task CleanupInvalidRefreshTokens();
        Task CleanupInvalidUserTokens();
        Task MakeAssignmentsFailed();
    }
}
