namespace server.DTO.User
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; } = false;
        public DateTime CreatedAt { get; set; }
    }
}
