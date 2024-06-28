using server.DTO.Assignment;

namespace server.DTO.User
{
    public class MyInfoDTO
    {
        public required UserDTO User { get; set; }
        public required AssignmentCountDTO AssignmentCount { get; set; }
    }
}
