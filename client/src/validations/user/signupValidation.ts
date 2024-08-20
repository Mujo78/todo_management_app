import * as Yup from "yup";

const regPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string()
      .required("signupFormValidation.nameRequired")
      .min(5, "signupFormValidation.nameLength"),
    email: Yup.string()
      .required("signupFormValidation.emailRequired")
      .email("signupFormValidation.emailValid")
      .test(
        "email-validation",
        "signupFormValidation.invalidEmailWord",
        function (value) {
          if (
            value.includes(
              "admin@" || "administrator" || "application" || "support"
            )
          )
            return false;
          else return true;
        }
      ),
    password: Yup.string()
      .required("signupFormValidation.passwordRequired")
      .min(8, "signupFormValidation.passwordLength")
      .matches(regPattern, {
        message: "signupFormValidation.passwordWeakness",
      }),
    confirmPassword: Yup.string()
      .required("signupFormValidation.confirmPasswordRequired")
      .test(
        "password-match",
        "signupFormValidation.passwordsMustMatch",
        function (value) {
          return value === this.parent.password;
        }
      ),
  });
};

export default getValidationSchema;
