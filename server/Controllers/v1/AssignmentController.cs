using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.DTO.Assignment;
using server.Exceptions;
using server.Filters;
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
        [ProducesResponseType(typeof(PaginationResultDTO<AssignmentDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll([FromQuery(Name = "Name")] string? name, int pageNum = 1)
        {
            var assignments = await assignmentService.GetAllAssignmentsAsync(name, pageNum);
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
            if (Id.Equals("") || Id.Equals(Guid.Empty)) throw new BadRequestException("taskService.invalidID");

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
            if (Id.Equals("") || Id.Equals(Guid.Empty)) throw new BadRequestException("deleteTaskService.invalidId");

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
            return Ok("deleteTasksService");
        }

        [HttpDelete("selected")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteSelectedAssignemnts([FromBody] List<Guid> assignmentIds)
        {
            await assignmentService.DeleteSelectedAssignmentsAsync(assignmentIds);
            return Ok("deleteTasksService");
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

        [HttpPatch("{Id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> MakeAssignmentFailed([FromRoute] Guid Id)
        {
            var assignment = await assignmentService.MakeAssignmentExpiredAndFailed(Id);
            return Ok(assignment);
        }

        [HttpPatch]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> MakeAssignemntsFinished([FromBody] List<Guid> assignmentIds)
        {
            await assignmentService.MakeAssignmentsCompleted(assignmentIds);
            return Ok("finishTasksService");
        }

        [AllowAnonymous]
        [HttpPost("/seed-database-assignments")]
        [TypeFilter(typeof(TestingOnly))]
        [ApiExplorerSettings(IgnoreApi=true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task SeedDatabaseWithAssignments()
        {
            await assignmentService.SeedDatabase();
        }

        [AllowAnonymous]
        [HttpDelete("/database-assignments-delete-added")]
        [TypeFilter(typeof(TestingOnly))]
        [ApiExplorerSettings(IgnoreApi = true)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task DeleteAssignmentAddedInTestingEnv()
        {
            await assignmentService.DeleteTestingAssignment();
        }
    }
}
