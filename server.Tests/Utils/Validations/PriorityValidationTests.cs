using FluentAssertions;
using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.Tests.Utils.Validations
{
    public class PriorityValidationTests
    {
        [Theory]
        [InlineData(true)]
        [InlineData(Status.Open)]
        public void PriorityValidation_TestShouldFail_WhenValueIsNullOrNotStatus(object value)
        {
            ValidationContext context = new(value);
            PriorityValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("Please choose valid priority for assignment.");
        }

        [Theory]
        [InlineData((Priority)100)]
        [InlineData((Priority)50)]
        [InlineData((Priority)25)]
        public void PriorityValidation_TestShouldFail_WhenValueIsOutOfStatusScope(object value)
        {
            ValidationContext context = new(value);
            PriorityValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("Priority must be: Low, Medium or High.");
        }

        [Theory]
        [InlineData(Priority.High)]
        [InlineData(Priority.Medium)]
        [InlineData(Priority.Low)]
        public void PriorityValidation_TestShouldBeSuccess(object value)
        {
            ValidationContext context = new(value);
            PriorityValidation attribute = new();

            var result = attribute.GetValidationResult(value, context)!;
            ValidationResult validationResult = result;

            validationResult.Should().Be(ValidationResult.Success);
        }
    }
}
