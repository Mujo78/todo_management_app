using server.DTO;
using server.DTO.Assignment;

namespace server.Services.IService
{
    public interface IAssignmentService
    {
        Task<PaginationResultDTO<AssignmentDTO>> GetAllAssignmentsAsync(string? title, int pageNum);
        Task<AssignmentDTO?> GetAssignmentAsync(Guid taskId);
        Task<AssignmentDTO> CreateAssignmentAsync(AssignmentCreateDTO assignment);
        Task<AssignmentDTO> UpdateAssignmentAsync(Guid taskId, AssignmentUpdateDTO updateDTO);
        Task DeleteAssignmentAsync(Guid taskId);
        Task DeleteAllAssignmentsAsync();
    }
}
