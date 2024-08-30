using FluentAssertions;
using server.Utils.Enums;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.Tests.Utils.Validations
{
    public class StatusValidationTests
    {
        [Theory]
        [InlineData(true)]
        [InlineData(Priority.Medium)]
        public void StatusValidation_TestShouldFail_WhenValueIsNullOrNotStatus(object value)
        {
            ValidationContext context = new(value);
            StatusValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("taskFormService.statusValid");
        }

        [Theory]
        [InlineData((Status)100)]
        [InlineData((Status)50)]
        [InlineData((Status)25)]
        public void StatusValidation_TestShouldFail_WhenValueIsOutOfStatusScope(object value)
        {
            ValidationContext context = new(value);
            StatusValidation attribute = new();

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("taskFormService.statusValidOption");
        }

        [Theory]
        [InlineData(Status.Completed)]
        [InlineData(Status.Open)]
        [InlineData(Status.Failed)]
        public void StatusValidation_TestShouldBeSuccess(object value)
        {
            ValidationContext context = new(value);
            StatusValidation attribute = new();

            var result = attribute.GetValidationResult(value, context)!;
            ValidationResult validationResult = result;

            validationResult.Should().Be(ValidationResult.Success);
        }


    }
}
