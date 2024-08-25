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
                return new ValidationResult("taskFormService.priorityValid");
            }

            if(!Enum.IsDefined(typeof(Priority), value)) 
            {
                return new ValidationResult("taskFormService.priorityValidOption");
            }

            return ValidationResult.Success;
        }
    }
}
