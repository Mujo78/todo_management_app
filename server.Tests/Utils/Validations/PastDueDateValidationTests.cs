using FluentAssertions;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.Tests.Utils.Validations
{
    public class PastDueDateValidationTests
    {
        [Theory]
        [InlineData("NotValidDate")]
        public void PastDueDateValidation_TestShouldFail_WhenValueIsNullOrNotStatus(object value)
        {
            ValidationContext context = new(value);
            PastDueDateValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("taskFormService.invalidDate");
        }

        [Fact]
        public void PastDueDateValidation_TestShouldFail_WhenDateIsInThePast()
        {
            DateTime value = DateTime.UtcNow.AddDays(-20);
            ValidationContext context = new(value);
            PastDueDateValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("taskFormService.dueDatePast");
        }

        [Fact]
        public void PastDueDateValidation_TestShouldBeSuccess()
        {
            DateTime value = DateTime.UtcNow.AddDays(40);
            ValidationContext context = new(value);
            PastDueDateValidation attribute = new();

            var result = attribute.GetValidationResult(value, context)!;
            ValidationResult validationResult = result;

            validationResult.Should().Be(ValidationResult.Success);
        }
    }
}
