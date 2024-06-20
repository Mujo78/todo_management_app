
using server.Utils.Enums;
using System.ComponentModel.DataAnnotations;

namespace server.Utils.Validations
{
    public class StatusValidation: ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            if (value == null || value is not Status)
            {
                return new ValidationResult("Please choose valid status for assignment.");
            }

            if (!Enum.IsDefined(typeof(Status), value))
            {
                return new ValidationResult("Status must be: Open, Completed or Failed.");
            }

            return ValidationResult.Success;
        }
    }
}
