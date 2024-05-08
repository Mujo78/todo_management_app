using server.Utils.Enums;
using System.ComponentModel.DataAnnotations;

namespace server.Utils.Validations
{
    public class PriorityValidation: ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            if (value == null || value is not Priority)
            {
                return new ValidationResult("Please choose valid priority for assignment.");
            }

            if(!Enum.IsDefined(typeof(Priority), value)) 
            {
                return new ValidationResult("Priority must be: Low, Medium or High.");
            }

            return ValidationResult.Success;
        }
    }
}
