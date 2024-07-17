import * as Yup from "yup";

const regPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .min(5, "Name must be at least 5 characters long."),
  email: Yup.string()
    .required("Email is required.")
    .email("Please provide valid email.")
    .test(
      "email-validation",
      "Invalid email address, please provide valid email to create an account.",
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
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(regPattern, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    }),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .test("password-match", "Passwords must match", function (value) {
      return value === this.parent.password;
    }),
});
