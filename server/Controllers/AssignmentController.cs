using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;
using server.Models;
using server.Repository;

namespace server.Controllers
{
    [Route("api/assignments/")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private IAssignmentRepository repository;
        private IMapper mapper;
        public AssignmentController(IAssignmentRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AssignmentDTO>), 200)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            IEnumerable<Assignment> assignemnts = await repository.GetAllAssignments();
            return Ok(mapper.Map<IEnumerable<AssignmentDTO>>(assignemnts));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), 200)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetAssignment(int id)
        {
            if (id == 0) return BadRequest("Invalid ID sent.");

            var assignment = await repository.GetAssignmentById(id);

            if (assignment == null) return NotFound("Assignment not found!");

            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteAssignment(int id)
        {
            if (id == 0) return BadRequest();

            Assignment? assignment = await repository.GetAssignmentById(id);

            if (assignment == null) return NotFound("Assignment not found!");

            bool deleted = await repository.RemoveAssignment(assignment);

            if (!deleted) return BadRequest("Assignment not deleted.");
            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }
    }
}
