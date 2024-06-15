using server.DTO.User;

namespace server.DTO.Auth
{
    public class LoginDataDTO
    {
        public string AccessToken { get; set; } = string.Empty;
        public required UserDTO User { get; set; }
    }
}
