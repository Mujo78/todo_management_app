using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace server.Utils.Validations
{
    public class PasswordValidation(string FieldName) : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            string regPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

            if (value != null && !value.Equals("") && !Regex.IsMatch((string)value, regPattern))
            {
                return new ValidationResult($"{FieldName} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
            }

            return ValidationResult.Success;
        }
    }
}
