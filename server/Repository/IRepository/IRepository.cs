using server.Models;

namespace server.Repository.IRepository
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid Id);
        Task<bool> CreateAsync(T entity);
        Task<bool> RemoveAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<bool> SaveAsync();
    }
}
