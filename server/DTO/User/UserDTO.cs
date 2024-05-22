﻿namespace server.DTO.User
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; } = false;
        public DateTime CreatedAt { get; set; }
    }
}