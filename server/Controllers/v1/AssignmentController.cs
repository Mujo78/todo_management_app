using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO.Assignment;
using server.Exceptions;
using server.Services.IService;

namespace server.Controllers.v1
{
    [Authorize]
    [Route("api/v{version:apiVersion}/assignments/")]
    [ApiVersion("1.0")]
    [ApiController]
    public class AssignmentController(IAssignmentService assignmentService) : ControllerBase
    {
        private readonly IAssignmentService assignmentService = assignmentService;

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AssignmentDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            var assignments = await assignmentService.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("{Id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAssignment([FromRoute] Guid Id)
        {
            if (Id.Equals("")) throw new BadRequestException("Invalid ID sent.");

            var assignment = await assignmentService.GetAssignmentAsync(Id);
            return Ok(assignment);
        }

        [HttpDelete("{Id}")]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteAssignment([FromRoute] Guid Id)
        {
            if (Id.Equals("")) throw new BadRequestException("Invalid ID sent.");

            await assignmentService.DeleteAssignmentAsync(Id);
            return Ok(Id);
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
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CreateNewAssignment([FromBody] AssignmentCreateDTO createDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var newAssignment = await assignmentService.CreateAssignmentAsync(createDTO);
            return Ok(newAssignment);
        }


        [HttpPut("{Id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateExistingAssignment([FromRoute] Guid Id, [FromBody] AssignmentUpdateDTO updateDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var assignment = await assignmentService.UpdateAssignmentAsync(Id, updateDTO);
            return Ok(assignment);
        }
    }
}
