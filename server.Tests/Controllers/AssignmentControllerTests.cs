using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers.v1;
using server.DTO;
using server.DTO.Assignment;
using server.DTO.User;
using server.Exceptions;
using server.Services.IService;
using System.Collections;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace server.Tests.Controllers
{
    public class AssignmentControllerTests
    {
        private readonly Mock<IAssignmentService> _assignmentServiceMock;
        private readonly AssignmentController _controller;

        public AssignmentControllerTests()
        {
            _assignmentServiceMock = new Mock<IAssignmentService>();
            _controller = new AssignmentController(_assignmentServiceMock.Object);
        }

        [Fact]
        public async Task GetAll_ShoudBeSuccess()
        {
            var data = new AssignmentDTO[1]
            {
                new() {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    Description = "description",
                    DueDate = DateTime.UtcNow.AddDays(20),
                    Priority = server.Utils.Enums.Priority.High,
                    Status = server.Utils.Enums.Status.Open,
                    Title = "Title for new assignment",
                    UpdatedAt = DateTime.UtcNow,
                    UserId = Guid.NewGuid(),
                },
            };

            var expectedDataResult = new PaginationResultDTO<AssignmentDTO>(data, 1, 1);

            _assignmentServiceMock.Setup(service => service.GetAllAssignmentsAsync("Title for new assignment", 1)).ReturnsAsync(expectedDataResult);

            var result = await _controller.GetAll("Title for new assignment", 1);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<PaginationResultDTO<AssignmentDTO>>(isSuccess.Value);
            Assert.Equal(data[0].Id, value.Data.First().Id);
        }


        [Fact]
        public async Task GetAssignment_ShoudReturnBadRequestForInvalidId()
        {
            var taskId = Guid.Empty;

            var result = await Assert.ThrowsAsync<BadRequestException>(() => _controller.GetAssignment(taskId));
            Assert.Equal("taskService.invalidID", result.Message);
        }

        [Fact]
        public async Task GetAssignment_ShoudBeSuccess()
        {
            var taskId = Guid.NewGuid();

            AssignmentDTO data = new()
            {
                Id = taskId,
                CreatedAt = DateTime.UtcNow,
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "Title for new assignment",
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
            };

            _assignmentServiceMock.Setup(service => service.GetAssignmentAsync(taskId)).ReturnsAsync(data);
            var result = await _controller.GetAssignment(taskId);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<AssignmentDTO>(isSuccess.Value);
            Assert.Equal(data.Id, value.Id);
        }

        [Fact]
        public async Task DeleteAssignment_ShoudReturnBadRequestForInvalidId()
        {
            var taskId = Guid.Empty;

            var result = await Assert.ThrowsAsync<BadRequestException>(() => _controller.DeleteAssignment(taskId));
            Assert.Equal("deleteTaskService.invalidId", result.Message);
        }

        [Fact]
        public async Task DeleteAssignment_ShoudBeSuccess()
        {
            var taskId = Guid.NewGuid();

            _assignmentServiceMock.Setup(service => service.DeleteAssignmentAsync(taskId)).Returns(Task.CompletedTask);
            var result = await _controller.DeleteAssignment(taskId);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<Guid>(isSuccess.Value);
            Assert.Equal(taskId, value);
        }

        [Fact]
        public async Task DeleteAllAssignments_ShoudBeSuccess()
        {
            _assignmentServiceMock.Setup(service => service.DeleteAllAssignmentsAsync()).Returns(Task.CompletedTask);
            var result = await _controller.DeleteMyAssignments();

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<string>(isSuccess.Value);
            Assert.Equal("deleteTasksService", value);
        }

        [Fact]
        public async Task DeleteSelectedAssignemnts_ShoudBeSuccess()
        {
            Guid assignmentId = Guid.NewGuid();
            List<Guid> assignmentIds = [assignmentId];

            _assignmentServiceMock.Setup(service => service.DeleteSelectedAssignmentsAsync(assignmentIds)).Returns(Task.CompletedTask);
            var result = await _controller.DeleteSelectedAssignemnts(assignmentIds);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<string>(isSuccess.Value);
            Assert.Equal("deleteTasksService", value);
        }

        [Fact]
        public async Task CreateAssignemnt_ShoudReturnBadRequestForTitleBeingShort()
        {
            AssignmentCreateDTO data = new()
            {
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "Short",
            };

            _controller.ModelState.AddModelError("Title", "Title must be at least 10 characters long.");

            var result = await _controller.CreateNewAssignment(data);

            var isSuccess = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(isSuccess.Value);

            Assert.True(modelState.ContainsKey("Title"));
            Assert.Contains("Title must be at least 10 characters long.", (string[])modelState["Title"]);
        }

        [Fact]
        public async Task CreateAssignemnt_ShoudBeSuccess()
        {
            AssignmentCreateDTO data = new()
            {
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "Learn something new as title",
            };

            AssignmentDTO expectedData = new()
            {
                Description = data.Description,
                DueDate = data.DueDate,
                Priority = data.Priority,
                Status = data.Status,
                Title = data.Title,
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
            };

            _assignmentServiceMock.Setup(service => service.CreateAssignmentAsync(data)).ReturnsAsync(expectedData);
            var result = await _controller.CreateNewAssignment(data);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<AssignmentDTO>(isSuccess.Value);

            Assert.Equal(expectedData.Id, value.Id);
        }


        [Fact]
        public async Task UpdateAssignemnt_ShoudReturnBadRequestForTitleBeingRequired()
        {
            Guid taskId = Guid.NewGuid();

            AssignmentUpdateDTO updateData = new()
            {
                Id = taskId,
                CreatedAt = DateTime.UtcNow,
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "",
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
            };

            _controller.ModelState.AddModelError("Title", "The field Title is required.");

            var result = await _controller.UpdateExistingAssignment(taskId, updateData);

            var isSuccess = Assert.IsType<BadRequestObjectResult>(result);
            var modelState = Assert.IsType<SerializableError>(isSuccess.Value);

            Assert.True(modelState.ContainsKey("Title"));
            Assert.Contains("The field Title is required.", (string[])modelState["Title"]);
        }

        [Fact]
        public async Task UpdateAssignemnt_ShoudBeSuccess()
        {
            Guid taskId = Guid.NewGuid();

            AssignmentUpdateDTO data = new()
            {
                Id = taskId,
                CreatedAt = DateTime.UtcNow,
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "New title for an assignment.",
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
            };

            AssignmentDTO expectedData = new()
            {
                Description = data.Description,
                DueDate = data.DueDate,
                Priority = data.Priority,
                Status = data.Status,
                Title = data.Title,
                Id = data.Id,
                CreatedAt = data.CreatedAt,
                UpdatedAt = data.UpdatedAt,
                UserId = data.UserId,
            };

            _assignmentServiceMock.Setup(service => service.UpdateAssignmentAsync(taskId, data)).ReturnsAsync(expectedData);
            var result = await _controller.UpdateExistingAssignment(taskId, data);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<AssignmentDTO>(isSuccess.Value);

            Assert.Equal(expectedData.Id, value.Id);
        }

        [Fact]
        public async Task MakeAssignmentFailed_ShoudBeSuccess()
        {
            var taskId = Guid.NewGuid();

            AssignmentDTO data = new()
            {
                Id = taskId,
                CreatedAt = DateTime.UtcNow,
                Description = "description",
                DueDate = DateTime.UtcNow.AddDays(20),
                Priority = server.Utils.Enums.Priority.High,
                Status = server.Utils.Enums.Status.Open,
                Title = "Title for new assignment",
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
            };

            _assignmentServiceMock.Setup(service => service.MakeAssignmentExpiredAndFailed(taskId)).ReturnsAsync(data);
            var result = await _controller.MakeAssignmentFailed(taskId);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<AssignmentDTO>(isSuccess.Value);
            Assert.Equal(data.Id, value.Id);
        }

        [Fact]
        public async Task MakeAssignmentsFinished_ShoudBeSuccess()
        {
            Guid assignmentId = Guid.NewGuid();
            List<Guid> assignmentIds = [assignmentId];

            _assignmentServiceMock.Setup(service => service.MakeAssignmentsCompleted(assignmentIds)).Returns(Task.CompletedTask);
            var result = await _controller.MakeAssignemntsFinished(assignmentIds);

            var isSuccess = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<string>(isSuccess.Value);
            Assert.Equal("finishTasksService", value);
        }
    }
}
