﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    [Table("refresh_tokens")]
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string JwtTokenId { get; set; }
        public string Refresh_Token { get; set; }
        public bool IsValid { get; set; }
        public DateTime ExpiresAt { get; set; }


        public User User { get; set; }

    }
}
