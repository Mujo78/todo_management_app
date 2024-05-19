using AutoMapper;
using server.DTO.Assignment;
using server.Exceptions;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;

namespace server.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly IAssignmentRepository repository;
        private readonly IAuthRepository authRepository;
        private readonly IMapper mapper;
        public AssignmentService(IAssignmentRepository repository, IAuthRepository authRepository, IMapper mapper)
        {
            this.repository = repository;
            this.authRepository = authRepository;
            this.mapper = mapper;
        }

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

        public async Task<bool> CreateAssignmentAsync(Assignment assignment)
        {
            assignment.CreatedAt = DateTime.Now;
            assignment.UpdatedAt = DateTime.Now;

            return await repository.CreateAsync(assignment);
        }

        public async Task<bool> DeleteAllAssignmentsAsync()
        {
            var userId = authRepository.GetUserId();
            bool result = await repository.RemoveAllAssignments(userId);

            if (!result) throw new Exception("Assignments not deleted.");
            return result;
        }

        public async Task<bool> DeleteAssignmentAsync(Assignment assignment)
        {
            var userId = authRepository.GetUserId();
            if (!assignment.UserId.Equals(userId)) throw new ForbidException("You do not have permission to access this resource.");
            
            bool result = await repository.RemoveAsync(assignment);
            if (!result) throw new Exception("Assignment not deleted.");

            return result;
        }

        public async Task<bool> UpdateAssignmentAsync(Assignment assignment)
        {
            assignment.UpdatedAt = DateTime.Now;
            return await repository.UpdateAsync(assignment);
        }
    }
}
