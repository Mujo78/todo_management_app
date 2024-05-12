using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTO;
using server.Interfaces;
using server.Models;

namespace server.Controllers.v1
{
    [Authorize]
    [Route("api/assignments/")]
    [ApiController]
    public class AssignmentController(IAssignmentRepository repository, IMapper mapper, IUserRepository userRepository) : ControllerBase
    {
        private readonly IAssignmentRepository repository = repository;
        private readonly IUserRepository userRepository = userRepository;
        private readonly IMapper mapper = mapper;

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AssignmentDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetAll()
        {
            var userId = userRepository.GetUserId();

            IEnumerable<Assignment> assignemnts = await repository.GetAllAssignments(userId);
            return Ok(mapper.Map<IEnumerable<AssignmentDTO>>(assignemnts));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetAssignment([FromRoute] Guid id)
        {
            var userId = userRepository.GetUserId();

            if (id.Equals("")) return BadRequest("Invalid ID sent.");

            var assignment = await repository.GetAssignmentById(id, userId);
            if (assignment == null) return NotFound("Assignment not found!");

            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteAssignment([FromRoute] Guid id)
        {
            var userId = userRepository.GetUserId();
            
            if (id.Equals("")) return BadRequest("Invalid ID sent.");

            Assignment? assignment = await repository.GetAssignmentById(id, userId);
            if (assignment == null) return NotFound("Assignment not found!");

            bool deleted = await repository.RemoveAssignment(assignment);
            if (!deleted) return BadRequest("Assignment not deleted.");

            return Ok(mapper.Map<AssignmentDTO>(assignment));
        }

        [HttpPost]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CreateNewAssignment([FromBody] AssignmentCreateDTO createDTO)
        {
            var userId = userRepository.GetUserId();

            var isExists = repository.AssignmentExists(createDTO.Title, userId);
            if (isExists) return BadRequest($"Assignment with name: {createDTO.Title} already exists.");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            Assignment assignmentToCreate = mapper.Map<Assignment>(createDTO);

            bool isSuccess = await repository.CreateAssignment(assignmentToCreate);
            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToCreate));
        }


        [HttpPut("{id}")]
        [ProducesResponseType(typeof(AssignmentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UpdateExistingAssignment([FromRoute] Guid id, [FromBody] AssignmentUpdateDTO updateDTO)
        {
            var userId = userRepository.GetUserId();

            if (id.Equals("") || !updateDTO.Id.Equals(id) || !updateDTO.UserId.Equals(userId) || updateDTO == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var isExists = repository.AssignmentExists(id, userId);
            if (!isExists) return NotFound("Assignment not found.");

            var isExistsName = repository.AssignmentExists(updateDTO.Title, updateDTO.Id, userId);
            if (isExistsName) return BadRequest($"Assignment with name: {updateDTO.Title} already exists.");

            Assignment assignmentToUpdate = mapper.Map<Assignment>(updateDTO);

            var isSuccess = await repository.UpdateAssignment(assignmentToUpdate);
            if (!isSuccess) return BadRequest("Assignment is not saved.");

            return Ok(mapper.Map<AssignmentDTO>(assignmentToUpdate));
        }
    }
}
