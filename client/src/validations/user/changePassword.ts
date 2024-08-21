import * as Yup from "yup";

const regPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string().required(
    "changePasswordFormValidation.passwordRequired"
  ),
  newPassword: Yup.string()
    .required("changePasswordFormValidation.newPasswordRequired")
    .min(8, "changePasswordFormValidation.newPasswordLength")
    .matches(regPattern, {
      message: "changePasswordFormValidation.newPasswordWeakness",
    }),
  confirmNewPassword: Yup.string()
    .required("changePasswordFormValidation.confirmPasswordRequired")
    .test(
      "password-match",
      "changePasswordFormValidation.passwordsMustMatch",
      function (value) {
        return value === this.parent.newPassword;
      }
    ),
});
