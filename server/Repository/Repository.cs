using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Repository.IRepository;

namespace server.Repository
{
    public class Repository<T>(ApplicationDBContext applicationDB) : IRepository<T> where T : class
    {
        private readonly ApplicationDBContext applicationDBContext = applicationDB;

        public async Task<bool> CreateAsync(T entity)
        {
            await applicationDBContext.Set<T>().AddAsync(entity);
            return await SaveAsync();
        }

        public async Task<T?> GetByIdAsync(Guid Id)
        {
            return await applicationDBContext.Set<T>().FindAsync(Id);
        }

        public async Task<bool> RemoveAsync(T entity)
        {
            applicationDBContext.Set<T>().Remove(entity);
            return await SaveAsync();
        }
        public async Task<bool> UpdateAsync(T entity)
        {
            applicationDBContext.Set<T>().Update(entity);
            return await SaveAsync();
        }

        public async Task<bool> SaveAsync()
        {
            var saved = await applicationDBContext.SaveChangesAsync();
            return saved > 0;
        }

    }
}
