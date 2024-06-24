﻿using AutoMapper;
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
            bool result = await repository.RemoveAllAssignments(userId);

            if (!result) throw new Exception("Assignments not deleted.");
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
            if (isExistsName) throw new ConflictException($"Assignment with name: '{updateDTO.Title}' already exists.");

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);
            assignmentToUpdate.UpdatedAt = DateTime.Now;

            bool result = await repository.UpdateAsync(assignmentToUpdate);
            return result ? mapper.Map<AssignmentDTO>(assignmentToUpdate) : throw new Exception("Assignment not updated.");
        }

        public async Task MakeAssignmentsCompleted(List<Guid> assignmentsIds)
        {
            var userId = authService.GetUserId() ?? throw new UnauthorizedAccessException("You are not authorized.");
            if (assignmentsIds == null || assignmentsIds.Count == 0) throw new BadRequestException("No assignments provided.");

            var assignemnts = await repository.GetAssignmentsById(assignmentsIds, userId);
            if (assignemnts == null || assignemnts.Count() == 0) throw new NotFoundException("One or more assignments not found with the provided data.");

            foreach (var assignment in assignemnts)
            {
                assignment.Status = Status.Completed;
                assignment.UpdatedAt = DateTime.Now;
            }

            try
            {
                await repository.SaveAsync();
            }
            catch ( Exception ex )
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
