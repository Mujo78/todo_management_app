using System.ComponentModel.DataAnnotations;

namespace server.Utils.Validations
{
    public class PastDueDateValidation: ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            if(value == null || value is not DateTime)
            {
                return new ValidationResult("Invalid date!");
            }

            DateTime dueDate = (DateTime)value;

            if(DateTime.UtcNow > dueDate)
            {
                return new ValidationResult("Date can not be in the past!");
            }

            return ValidationResult.Success;
        }
    }
}
