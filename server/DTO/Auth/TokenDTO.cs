﻿namespace server.DTO.Auth
{
    public class TokenDTO
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;

    }
}
