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
            var assignment = await repository.GetAssignmentById(taskId, userId);

            return assignment == null ? throw new NotFoundException("Assignment not found.") : mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task<AssignmentDTO> CreateAssignmentAsync(AssignmentCreateDTO assignmentDTO)
        {
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("You are not authorized.");
            bool isExists = repository.AssignmentExists(assignmentDTO.Title, userId);
            if (isExists) throw new ConflictException($"Assignment with title: '{assignmentDTO.Title}' already exists.");

            assignmentDTO.DueDate = assignmentDTO.DueDate.ToLocalTime();

            Assignment assignmentToCreate = mapper.Map<Assignment>(assignmentDTO);

            assignmentToCreate.UserId = userId;
            assignmentToCreate.CreatedAt = DateTime.Now;
            assignmentToCreate.UpdatedAt = DateTime.Now;

            bool isSuccess = await repository.CreateAsync(assignmentToCreate);

            return isSuccess ? mapper.Map<AssignmentDTO>(assignmentToCreate) : throw new Exception("Assignment not created.");
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
            var assignment = await repository.GetAssignmentById(Id, userId) ?? throw new NotFoundException("Assignment not found.");
            if (!assignment.UserId.Equals(userId)) throw new ForbidException("You do not have permission to access this resource.");

            bool result = await repository.RemoveAsync(assignment);
            if (!result) throw new Exception("Assignment not deleted.");
        }

        public async Task<AssignmentDTO> UpdateAssignmentAsync(Guid taskId, AssignmentUpdateDTO updateDTO)
        {
            var userId = authService.GetUserId();

            if (taskId.Equals("") || updateDTO == null || !updateDTO.Id.Equals(taskId)) throw new BadRequestException("Invalid ID sent.");
            if (!updateDTO.UserId.Equals(userId)) throw new ForbidException("You do not have permission to access this resource.");

            bool isExists = repository.AssignmentExists(taskId, userId);
            if (!isExists) throw new NotFoundException("Assignment not found.");

            bool isExistsName = repository.AssignmentExists(updateDTO.Title, updateDTO.Id, userId);
            if (isExistsName) throw new ConflictException($"Assignment with title: '{updateDTO.Title}' already exists.");

            updateDTO.DueDate = updateDTO.DueDate.ToLocalTime();

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);
            if (assignmentToUpdate.Status.Equals(Status.Failed))
            {
                assignmentToUpdate.Status = Status.Open;
            }
            assignmentToUpdate.UpdatedAt = DateTime.Now;

            bool result = await repository.UpdateAsync(assignmentToUpdate);
            return result ? mapper.Map<AssignmentDTO>(assignmentToUpdate) : throw new Exception("Assignment not updated.");
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
                await repository.SaveAsync();
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
            if (Id.Equals(null) || Id.Equals(Guid.Empty)) throw new BadRequestException("Please provide valid ID for assignment.");
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("You are not authorized.");
            
            var assignment = await repository.GetTrackingAssignmentById(Id, userId) ?? throw new NotFoundException("Task not found.");
            if (assignment.Status != Status.Open) throw new BadRequestException("Task is already failed or completed.");

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

        public async Task<IEnumerable<Assignment>> FindAssignmentsByIds(List<Guid> assignmentsIds)
        {
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("You are not authorized.");
            if (assignmentsIds == null || assignmentsIds.Count == 0) throw new BadRequestException("No assignments provided.");

            var assignments = await repository.GetAssignmentsById(assignmentsIds, userId);
            if (assignments == null || !assignments.Any()) throw new NotFoundException("One or more assignments not found with the provided data.");

            return assignments;
        }
    }
}
