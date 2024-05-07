using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;
using server.Models;

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
        public async Task<ActionResult> GetAssignment([FromRoute] int id)
        {
            if (id == 0) return BadRequest("Invalid ID sent.");

            var assignment = await repository.GetAssignmentById(id);

            if (assignment == null) return NotFound("Assignment not found!");

            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), 200)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteAssignment([FromRoute] int id)
        {
            if (id == 0) return BadRequest();

            Assignment? assignment = await repository.GetAssignmentById(id);

            if (assignment == null) return NotFound("Assignment not found!");

            bool deleted = await repository.RemoveAssignment(assignment);

            if (!deleted) return BadRequest("Assignment not deleted.");
            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }

        [HttpPost]
        [ProducesResponseType(typeof(AssignmentDTO), 201)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CreateNewAssignment([FromBody] AssignmentCreateDTO createDTO)
        {
            var isExists = await repository.ExistsByName(createDTO.Title);

            if (isExists) return BadRequest($"Assignment with name: {createDTO.Title} already exists.");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            Assignment assignmentToCreate = mapper.Map<Assignment>(createDTO);

            bool isSuccess = await repository.CreateAssignment(assignmentToCreate);

            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToCreate));
        }


        [HttpPut("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), 201)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdateExistingAssignment([FromRoute] int id, [FromBody] AssignmentUpdateDTO updateDTO)
        {

            if (id == 0 || updateDTO.Id != id || updateDTO == null) return BadRequest();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var isExists = await repository.ExistsById(id);
            if (!isExists) return NotFound("Assignment not found.");

            var isExistsName = await repository.ExistsByName(updateDTO.Title);
            if (isExistsName) return BadRequest($"Assignment with name: {updateDTO.Title} already exists.");


            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);

            bool isSuccess = await repository.UpdateAssignment(assignmentToUpdate);
            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToUpdate));
        }
    }
}
