using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace server.Utils.Validations
{
    public class PasswordValidation : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || value.ToString() == "")
            {
                return new ValidationResult("Password is required!");
            }

            string regPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

            if (!Regex.IsMatch((string)value, regPattern))
            {
                return new ValidationResult("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
            }

            return ValidationResult.Success;
        }
    }
}
