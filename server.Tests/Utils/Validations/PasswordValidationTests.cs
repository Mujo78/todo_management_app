using FluentAssertions;
using server.Utils.Validations;
using System.ComponentModel.DataAnnotations;

namespace server.Tests.Utils.Validations
{
    public class PasswordValidationTests
    {
        [Theory]
        [InlineData("password")]
        [InlineData("string")]
        public void PasswordValidation_TestShouldFail_WhenValueIsNotMatchingRegEx(object value)
        {
            ValidationContext context = new(value);
            PasswordValidation attribute = new("signupFormValidation.passwordWeakness");

            ValidationResult result = attribute.GetValidationResult(value, context)!;

            result.Should().NotBe(ValidationResult.Success);
            result.ErrorMessage.Should().Be("signupFormValidation.passwordWeakness");
        }

        [Theory]
        [InlineData("Password&12345")]
        [InlineData("String&1234567")]
        public void PasswordValidation_TestShouldBeSuccess(object value)
        {
            ValidationContext context = new(value);
            PasswordValidation attribute = new("Password");

            ValidationResult result = attribute.GetValidationResult(value, context)!;
            
            result.Should().Be(ValidationResult.Success);
        }
    }
}
