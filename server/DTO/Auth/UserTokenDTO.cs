using server.DTO.User;

namespace server.DTO.Auth
{
    public class UserTokenDTO
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public required UserDTO User { get; set; }
    }
}
