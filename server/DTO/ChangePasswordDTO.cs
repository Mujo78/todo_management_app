﻿using System.ComponentModel.DataAnnotations;
using server.Utils.Validations;

namespace server.DTO
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "Old password is required.")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "New password is required.")]
        [PasswordValidation]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm new password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [PasswordValidation]
        public string ConfirmNewPassword { get; set; }

    }
}
