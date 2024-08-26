using AutoMapper;
using server.DTO;
using server.DTO.Assignment;
using server.Exceptions;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;
using server.Utils.Enums;

namespace server.Services
{
    public class AssignmentService(IAssignmentRepository repository, IAuthService authService, IMapper mapper) : IAssignmentService
    {
        private readonly IAssignmentRepository repository = repository;
        private readonly IAuthService authService = authService;
        private readonly IMapper mapper = mapper;

        public async Task<PaginationResultDTO<AssignmentDTO>> GetAllAssignmentsAsync(string? title, int pageNum)
        {
            var userId = authService.GetUserId();
            var limit = 6;
            var assignments = await repository.GetAllAssignments(userId, title, pageNum, limit);

            var total = await repository.GetCountAssignments(userId, title);
            var numOfPages = (int)Math.Ceiling(total / (double)limit);

            PaginationResultDTO<AssignmentDTO> resultDTO = new(
                data: mapper.Map<IEnumerable<AssignmentDTO>>(assignments),
                pageNum, numOfPages
                );

            return resultDTO;
        }

        public async Task<AssignmentDTO?> GetAssignmentAsync(Guid taskId)
        {
            var userId = authService.GetUserId();
            var assignment = await repository.GetAssignmentById(taskId, userId) ?? throw new NotFoundException("taskService.taskNotFound");

            return mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task<AssignmentDTO> CreateAssignmentAsync(AssignmentCreateDTO assignmentDTO)
        {
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("addTaskService.notAuthorized");
            bool isExists = repository.AssignmentExists(assignmentDTO.Title, userId);
            if (isExists) throw new ConflictException("addTaskService.alreadyExists");

            assignmentDTO.DueDate = assignmentDTO.DueDate.ToLocalTime();

            Assignment assignmentToCreate = mapper.Map<Assignment>(assignmentDTO);

            assignmentToCreate.UserId = userId;
            assignmentToCreate.CreatedAt = DateTime.Now;
            assignmentToCreate.UpdatedAt = DateTime.Now;

            try
            {
                await repository.CreateAsync(assignmentToCreate);
                return mapper.Map<AssignmentDTO>(assignmentToCreate);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteAllAssignmentsAsync()
        {
            var userId = authService.GetUserId();

            try
            {
                await repository.RemoveAllAssignments(userId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteAssignmentAsync(Guid Id)
        {
            var userId = authService.GetUserId();
            var assignment = await repository.GetAssignmentById(Id, userId) ?? throw new NotFoundException("deleteTaskService.taskNotFound");
            if (!assignment.UserId.Equals(userId)) throw new ForbidException("deleteTaskService.forbidden");

            try
            {
                await repository.RemoveAsync(assignment);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssignmentDTO> UpdateAssignmentAsync(Guid taskId, AssignmentUpdateDTO updateDTO)
        {
            var userId = authService.GetUserId();

            if (taskId.Equals("") || updateDTO == null || !updateDTO.Id.Equals(taskId)) throw new BadRequestException("editTaskService.invalidID");
            if (!updateDTO.UserId.Equals(userId)) throw new ForbidException("editTaskService.forbidden");

            bool isExists = repository.AssignmentExists(taskId, userId);
            if (!isExists) throw new NotFoundException("editTaskService.taskNotFound");

            bool isExistsName = repository.AssignmentExists(updateDTO.Title, updateDTO.Id, userId);
            if (isExistsName) throw new ConflictException("editTaskService.alreadyExists");

            updateDTO.DueDate = updateDTO.DueDate.ToLocalTime();

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);
            if (assignmentToUpdate.Status.Equals(Status.Failed))
            {
                assignmentToUpdate.Status = Status.Open;
            }
            assignmentToUpdate.UpdatedAt = DateTime.Now;

            try
            {
                await repository.UpdateAsync(assignmentToUpdate);
                return mapper.Map<AssignmentDTO>(assignmentToUpdate);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task MakeAssignmentsCompleted(List<Guid> assignmentsIds)
        {
            var assignments = await FindAssignmentsByIds(assignmentsIds);

            foreach (var assignment in assignments)
            {
                assignment.Status = Status.Completed;
                assignment.UpdatedAt = DateTime.Now;
            }

            try
            {
                await repository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteSelectedAssignmentsAsync(List<Guid> assignmentsIds)
        {
            var assignments = await FindAssignmentsByIds(assignmentsIds);

            try
            {
                await repository.RemoveSelectedAssignments(assignments);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssignmentDTO> MakeAssignmentExpiredAndFailed(Guid Id)
        {
            if (Id.Equals(null) || Id.Equals(Guid.Empty)) throw new BadRequestException("taskExpiredAndFailed.invalidId");
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("taskExpiredAndFailed.notAuthorized");

            var assignment = await repository.GetTrackingAssignmentById(Id, userId) ?? throw new NotFoundException("taskExpiredAndFailed.taskNotFound");
            if (assignment.Status != Status.Open) throw new BadRequestException("taskExpiredAndFailed.taskAlreadyFailed");

            assignment.Status = Status.Failed;
            assignment.UpdatedAt = DateTime.Now;

            try
            {
                await repository.SaveChangesAsync();
                return mapper.Map<AssignmentDTO>(assignment);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SeedDatabase()
        {
            await repository.SeedTestingDatabase();
        }

        public async Task DeleteTestingAssignment()
        {
            await repository.DeleteAssignmentForTesting();
        }

        public async Task<IEnumerable<Assignment>> FindAssignmentsByIds(List<Guid> assignmentsIds)
        {
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("findAndValidateTasksService.notAuthorized");
            if (assignmentsIds == null || assignmentsIds.Count == 0) throw new BadRequestException("findAndValidateTasksService.noTasksProvided");

            var assignments = await repository.GetAssignmentsById(assignmentsIds, userId);
            if (assignments == null || !assignments.Any()) throw new NotFoundException("findAndValidateTasksService.oneOrMoreTasksNotFound");

            return assignments;
        }
    }
}
