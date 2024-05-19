using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO.Assignment;
using server.Models;
using server.Repository.IRepository;
using server.Services.IService;

namespace server.Controllers.v1
{
    [Authorize]
    [Route("api/assignments/")]
    [ApiController]
    public class AssignmentController(IAssignmentService assignmentService, IAssignmentRepository repository, IMapper mapper, IAuthRepository authRepository) : ControllerBase
    {
        private readonly IAssignmentService assignmentService = assignmentService;
        private readonly IAssignmentRepository repository = repository;
        private readonly IAuthRepository authRepository = authRepository;
        private readonly IMapper mapper = mapper;

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AssignmentDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            var assignments = await assignmentService.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAssignment([FromRoute] Guid id)
        {
            if (id.Equals("")) return BadRequest("Invalid ID sent.");
            var assignment = await assignmentService.GetAssignmentAsync(id);

            return Ok(assignment);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteAssignment([FromRoute] Guid id)
        {
            if (id.Equals("")) return BadRequest("Invalid ID sent.");

            var assignment = await assignmentService.GetAssignmentAsync(id);
            var toDelete = mapper.Map<Assignment>(assignment);

            await assignmentService.DeleteAssignmentAsync(toDelete);
            return Ok(assignment);
        }

        [HttpDelete]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteMyAssignments()
        {
            await assignmentService.DeleteAllAssignmentsAsync();
            
            return Ok("Assignments successfully deleted.");
        }

        [HttpPost]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateNewAssignment([FromBody] AssignmentCreateDTO createDTO)
        {
            //if (!createDTO.UserId.Equals(userId)) return BadRequest();

            //bool isExists = assignmentService..AssignmentExists(createDTO.Title, userId);
            //if (isExists) return BadRequest($"Assignment with name: {createDTO.Title} already exists.");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            Assignment assignmentToCreate = mapper.Map<Assignment>(createDTO);

            bool isSuccess = await assignmentService.CreateAssignmentAsync(assignmentToCreate);
            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToCreate));
        }


        [HttpPut("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateExistingAssignment([FromRoute] Guid id, [FromBody] AssignmentUpdateDTO updateDTO)
        {
           // var userId = authRepository.GetUserId();

            //if (id.Equals("") || updateDTO == null || !updateDTO.Id.Equals(id)) return BadRequest();
            //if (!updateDTO.UserId.Equals(userId)) return Forbid();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            //bool isExists = repository.AssignmentExists(id, userId);
            //if (!isExists) return NotFound("Assignment not found.");

            //bool isExistsName = repository.AssignmentExists(updateDTO.Title, updateDTO.Id, userId);
            //if (isExistsName) return BadRequest($"Assignment with name: {updateDTO.Title} already exists.");

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);

            bool isSuccess = await assignmentService.UpdateAssignmentAsync(assignmentToUpdate);
            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToUpdate));
        }
    }
}
