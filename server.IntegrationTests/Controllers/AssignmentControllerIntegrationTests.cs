using System.Net.Http.Json;
using System.Net;
using server.DTO.Assignment;
using Newtonsoft.Json;
using System.Text;
using server.DTO;
using FluentAssertions;

namespace server.IntegrationTests.Controllers
{
    public class AssignmentControllerIntegrationTests(ServerWebApplicationFactory factory) : TestBase(factory), IClassFixture<ServerWebApplicationFactory>
    {
        [Fact]
        public async Task GetAll_ShouldReturnNoResult()
        {
            var response = await _authorizedClient.GetAsync($"/api/v1/assignments?name=Task&pageNum=1");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<PaginationResultDTO<AssignmentDTO>>();
            Assert.NotNull(content);
            content.Data.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAll_ShouldBeSuccess_AndReturnAssignment()
        {
            var response = await _authorizedClient.GetAsync($"/api/v1/assignments?name=Test+Assignment+One&pageNum=1");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<PaginationResultDTO<AssignmentDTO>>();
            Assert.NotNull(content);
            Assert.Equal("Test Assignment One", content.Data.First().Title);
        }

        [Fact]
        public async Task GetAssignment_ShouldReturnNotFound_WhenAssignmentNotExists()
        {
            Guid assignmentId = Guid.NewGuid();

            var response = await _authorizedClient.GetAsync($"/api/v1/assignments/{assignmentId}");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Assignment not found.", content.Detail);
        }

        [Fact]
        public async Task GetAssignment_ShouldBeSuccess()
        {
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");

            var response = await _authorizedClient.GetAsync($"/api/v1/assignments/{assignmentId}");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AssignmentDTO>();
            Assert.NotNull(content);
            Assert.IsType<AssignmentDTO>(content);
            Assert.Equal(assignmentId, content.Id);
        }

        [Fact]
        public async Task CreateAssignment_ShouldReturnConflict_WhenAssignmentAlreadyExists()
        {
            AssignmentCreateDTO createDTO = new()
            {
                Title = "Test Assignment One",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PostAsJsonAsync($"/api/v1/assignments", createDTO);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal($"Assignment with title: '{createDTO.Title}' already exists.", content.Detail);
        }

        [Fact]
        public async Task CreateAssignment_ShouldBeSuccess()
        {
            AssignmentCreateDTO createDTO = new()
            {
                Title = "Test Assignment Four",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PostAsJsonAsync($"/api/v1/assignments", createDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AssignmentDTO>();
            Assert.NotNull(content);
            Assert.IsType<AssignmentDTO>(content);
            Assert.Equal(createDTO.Title, content.Title);
        }

        [Fact]
        public async Task DeleteMyAssignments_ShouldReturnUnauthorized()
        {
            var response = await _client.DeleteAsync($"/api/v1/assignments");
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteMyAssignments_ShouldBeSuccess()
        {
            var response = await _authorizedClient.DeleteAsync($"/api/v1/assignments");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Assignments successfully deleted.", content);
        }

        [Fact]
        public async Task DeleteAssignment_ShouldReturnNotFound_WhenAssignmentNotExists()
        {
            Guid assignmentId = Guid.NewGuid();

            var response = await _authorizedClient.DeleteAsync($"/api/v1/assignments/{assignmentId}");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Assignment not found.", content.Detail);
        }

        [Fact]
        public async Task DeleteAssignment_ShouldBeSuccess()
        {
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
            var response = await _authorizedClient.DeleteAsync($"/api/v1/assignments/{assignmentId}");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<Guid>();
            Assert.IsType<Guid>(content);
            Assert.Equal(assignmentId, content);
        }

        [Fact]
        public async Task UpdateAssignment_ShouldReturnBadRequest_WhenInvalidIdSent()
        {
            Guid userSecondId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            AssignmentUpdateDTO updateDTO = new()
            {
                CreatedAt = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                UpdatedAt = DateTime.UtcNow,
                UserId = userSecondId,
                Title = "Test Assignment One",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PutAsJsonAsync($"/api/v1/assignments/{Guid.NewGuid()}", updateDTO);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Invalid ID sent.", content.Detail);
        }

        [Fact]
        public async Task UpdateAssignment_ShouldReturnForbidden()
        {
            AssignmentUpdateDTO updateDTO = new()
            {
                CreatedAt = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                UpdatedAt = DateTime.UtcNow,
                UserId = Guid.NewGuid(),
                Title = "Test Assignment One",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PutAsJsonAsync($"/api/v1/assignments/{updateDTO.Id}", updateDTO);

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("You do not have permission to access this resource.", content.Detail);
        }

        [Fact]
        public async Task UpdateAssignment_ShouldReturnNotFound_WhenAssignmentNotFounded()
        {
            Guid userSecondId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            AssignmentUpdateDTO updateDTO = new()
            {
                CreatedAt = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                UpdatedAt = DateTime.UtcNow,
                UserId = userSecondId,
                Title = "Test Assignment One",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PutAsJsonAsync($"/api/v1/assignments/{updateDTO.Id}", updateDTO);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Assignment not found.", content.Detail);
        }

        [Fact]
        public async Task UpdateAssignment_ShouldReturnConflict_WhenAssignmentAlreadyExists()
        {
            Guid userSecondId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
            AssignmentUpdateDTO updateDTO = new()
            {
                CreatedAt = DateTime.UtcNow,
                Id = assignmentId,
                UpdatedAt = DateTime.UtcNow,
                UserId = userSecondId,
                Title = "Test Assignment Two",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PutAsJsonAsync($"/api/v1/assignments/{updateDTO.Id}", updateDTO);

            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal($"Assignment with title: '{updateDTO.Title}' already exists.", content.Detail);
        }

        [Fact]
        public async Task UpdateAssignment_ShouldBeSuccess()
        {
            Guid userSecondId = Guid.Parse("e569a650-3491-4833-a425-1d6412317b1e");
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
            AssignmentUpdateDTO updateDTO = new()
            {
                CreatedAt = DateTime.UtcNow,
                Id = assignmentId,
                UpdatedAt = DateTime.UtcNow,
                UserId = userSecondId,
                Title = "Test Assignment Three",
                Description = "Description",
                DueDate = DateTime.Now.AddDays(7),
                Priority = Utils.Enums.Priority.High,
                Status = Utils.Enums.Status.Open
            };

            var response = await _authorizedClient.PutAsJsonAsync($"/api/v1/assignments/{updateDTO.Id}", updateDTO);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AssignmentDTO>();
            Assert.NotNull(content);
            Assert.Equal(updateDTO.Title, content.Title);
        }

        [Fact]
        public async Task DeleteSelectedAssignments_ShouldReturnBadRequest_WhenNoAssignemntProvidedInArray()
        {
            List<Guid> assignmentIds = new();

            var request = new HttpRequestMessage(HttpMethod.Delete, "/api/v1/assignments/selected");
            request.Content = new StringContent(JsonConvert.SerializeObject(assignmentIds), Encoding.UTF8, "application/json");
            
            var response = await _authorizedClient.SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("No assignments provided.", content.Detail);
        }

        [Fact]
        public async Task DeleteSelectedAssignments_ShouldReturnNotFound_WhenNoAssignemntProvidedInArrayNotFounded()
        {
            List<Guid> assignmentIds = new()
            {
                Guid.NewGuid(),
                Guid.NewGuid()
            };

            var request = new HttpRequestMessage(HttpMethod.Delete, "/api/v1/assignments/selected");
            request.Content = new StringContent(JsonConvert.SerializeObject(assignmentIds), Encoding.UTF8, "application/json");

            var response = await _authorizedClient.SendAsync(request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("One or more assignments not found with the provided data.", content.Detail);
        }

        [Fact]
        public async Task DeleteSelectedAssignments_ShouldBeSuccess()
        {
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
            List<Guid> assignmentIds = new()
            {
                assignmentId
            };

            var request = new HttpRequestMessage(HttpMethod.Delete, "/api/v1/assignments/selected");
            request.Content = new StringContent(JsonConvert.SerializeObject(assignmentIds), Encoding.UTF8, "application/json");

            var response = await _authorizedClient.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Assignments successfully deleted.", content);
        }

        [Fact]
        public async Task MakeAssignmentsFinished_ShouldBeSuccess()
        {
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");
            List<Guid> assignmentIds = new()
            {
                assignmentId
            };

            var response = await _authorizedClient.PatchAsJsonAsync("/api/v1/assignments/", assignmentIds);

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotNull(content);
            Assert.Equal("Assignments successfully finished.", content);
        }

        [Fact]
        public async Task MakeAssignmentFailed_ShouldReturnBadRequest_WhenIdIsNotValid()
        {
            Guid assignmentId = Guid.Empty;
            
            var response = await _authorizedClient.PatchAsJsonAsync($"/api/v1/assignments/{assignmentId}", "");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Please provide valid ID for assignment.", content.Detail);
        }

        [Fact]
        public async Task MakeAssignmentFailed_ShouldReturnNotFound_WhenAssingmentNotExists()
        {
            Guid assignmentId = Guid.Empty;

            var response = await _authorizedClient.PatchAsJsonAsync($"/api/v1/assignments/{assignmentId}", "");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Please provide valid ID for assignment.", content.Detail);
        }

        [Fact]
        public async Task MakeAssignmentFailed_ShouldReturnBadRequest_WhenAssignmentIsAlreadyFinishedOrFailed()
        {
            Guid assignmentSecondId = Guid.Parse("c17541b0-a5b7-4004-9e85-15c60d2a9b62");

            var response = await _authorizedClient.PatchAsJsonAsync($"/api/v1/assignments/{assignmentSecondId}", "");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var content = await response.Content.ReadFromJsonAsync<ProblemDetails>();
            Assert.NotNull(content);
            Assert.Equal("Task is already failed or completed.", content.Detail);
        }

        [Fact]
        public async Task MakeAssignmentFailed_ShouldBeSuccess()
        {
            Guid assignmentId = Guid.Parse("d2bcc9c5-1540-4d2a-a815-f5fc8ad0706e");

            var response = await _authorizedClient.PatchAsJsonAsync($"/api/v1/assignments/{assignmentId}", "");

            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadFromJsonAsync<AssignmentDTO>();
            Assert.NotNull(content);
            Assert.Equal(assignmentId, content.Id);
        }
    }
}
