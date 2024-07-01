import * as Yup from "yup";

const regPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long."),
  newPassword: Yup.string()
    .required("New Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(regPattern, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    }),
  confirmNewPassword: Yup.string()
    .required("Confirm password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .test(
      "password-match",
      "Confirm Password must match with new password.",
      function (value) {
        return value === this.parent.newPassword;
      }
    ),
});
