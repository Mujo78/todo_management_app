
namespace server.Repository.IRepository
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid Id);
        Task CreateAsync(T entity);
        Task RemoveAsync(T entity);
        Task UpdateAsync(T entity);
        Task<bool> SaveAsync();
        Task SaveChangesAsync();
    }
}
