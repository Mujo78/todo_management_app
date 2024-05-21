using AutoMapper;
using server.DTO.Assignment;
using server.Exceptions;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;

namespace server.Services
{
    public class AssignmentService(IAssignmentRepository repository, IAuthRepository authRepository, IMapper mapper) : IAssignmentService
    {
        private readonly IAssignmentRepository repository = repository;
        private readonly IAuthRepository authRepository = authRepository;
        private readonly IMapper mapper = mapper;

        public async Task<IEnumerable<AssignmentDTO>> GetAllAssignmentsAsync()
        {
            var userId = authRepository.GetUserId();

            var assignments = await repository.GetAllAssignments(userId);
            return mapper.Map<IEnumerable<AssignmentDTO>>(assignments);
        }

        public async Task<AssignmentDTO?> GetAssignmentAsync(Guid taskId)
        {
            var userId = authRepository.GetUserId();
            var assignment = await repository.GetAssignmentById(taskId, userId);

            return assignment == null ? throw new NotFoundException("Assignment not found.") : mapper.Map<AssignmentDTO>(assignment);
        }

        public async Task<AssignmentDTO> CreateAssignmentAsync(AssignmentCreateDTO assignmentDTO)
        {
            var userId = authRepository.GetUserId();
            if (!assignmentDTO.UserId.Equals(userId)) throw new BadRequestException("Invalid ID sent.");

            bool isExists = repository.AssignmentExists(assignmentDTO.Title, userId);
            if (isExists) throw new ConflictException($"Assignment with name: '{assignmentDTO.Title}' already exists.");

            Assignment assignmentToCreate = mapper.Map<Assignment>(assignmentDTO);

            assignmentToCreate.CreatedAt = DateTime.Now;
            assignmentToCreate.UpdatedAt = DateTime.Now;

            bool isSuccess = await repository.CreateAsync(assignmentToCreate);

            return isSuccess ? mapper.Map<AssignmentDTO>(assignmentToCreate) : throw new Exception("Assignment not created.");
        }

        public async Task<bool> DeleteAllAssignmentsAsync()
        {
            var userId = authRepository.GetUserId();
            bool result = await repository.RemoveAllAssignments(userId);

            if (!result) throw new Exception("Assignments not deleted.");
            return result;
        }

        public async Task<bool> DeleteAssignmentAsync(Guid Id)
        {
            var userId = authRepository.GetUserId();
            var assignment = await repository.GetAssignmentById(Id, userId) ?? throw new NotFoundException("Assignment not found.");
            if (!assignment.UserId.Equals(userId)) throw new ForbidException("You do not have permission to access this resource.");
            
            bool result = await repository.RemoveAsync(assignment);
            if (!result) throw new Exception("Assignment not deleted.");

            return result;
        }

        public async Task<AssignmentDTO> UpdateAssignmentAsync(Guid taskId, AssignmentUpdateDTO updateDTO)
        {
            var userId = authRepository.GetUserId();
            
            if (taskId.Equals("") || updateDTO == null || !updateDTO.Id.Equals(taskId)) throw new BadRequestException("Invalid ID sent.");
            if (!updateDTO.UserId.Equals(userId)) throw new ForbidException("You do not have permission to access this resource.");

            bool isExists = repository.AssignmentExists(taskId, userId);
            if (!isExists) throw new NotFoundException("Assignment not found.");

            bool isExistsName = repository.AssignmentExists(updateDTO.Title, updateDTO.Id, userId);
            if (isExistsName) throw new ConflictException($"Assignment with name: '{updateDTO.Title}' already exists.");

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);
            assignmentToUpdate.UpdatedAt = DateTime.Now;

            bool result = await repository.UpdateAsync(assignmentToUpdate);
            return result ? mapper.Map<AssignmentDTO>(assignmentToUpdate) : throw new Exception("Assignment not updated.");
        }
    }
}
