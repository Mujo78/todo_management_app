using server.Models;

namespace server.Utils
{
    public class SeedAssignments
    {
        public static List<Assignment> GetSeedData()
        {
            return
        [
            new()
            {
                Id = Guid.Parse("c4b62272-2cdb-436b-a1b3-d770e6f11b44"),
                Title = "First Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Open,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.Parse("876e65d2-eb5c-4ab7-ad46-fe9c4a8884f7"),
                Title = "Second Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Failed,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.Parse("27884557-1ed9-4429-abb5-d2588e5d4e59"),
                Title = "Third Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Completed,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Task To Be Deleted",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Open,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Fourth Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Open,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Fifth Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Open,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            },
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Sixth Task Created",
                CreatedAt = DateTime.Now,
                Description = "",
                DueDate = DateTime.Now.AddDays(2),
                Priority = Enums.Priority.High,
                Status = Enums.Status.Open,
                UpdatedAt = DateTime.Now,
                UserId = Guid.Parse("5979e203-2d8e-4b99-bde3-2881fefe96e4")
            }
        ];
        }
    }
}
