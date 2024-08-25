
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
                return new ValidationResult("taskFormService.statusValid");
            }

            if (!Enum.IsDefined(typeof(Status), value))
            {
                return new ValidationResult("taskFormService.statusValidOption");
            }

            return ValidationResult.Success;
        }
    }
}
