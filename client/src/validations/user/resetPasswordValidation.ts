import * as Yup from "yup";

const regPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string()
    .required("resetPasswordFormValidation.passwordRequired")
    .min(8, "resetPasswordFormValidation.passwordLength")
    .matches(regPattern, {
      message: "resetPasswordFormValidation.passwordWeakness",
    }),
  confirmNewPassword: Yup.string()
    .required("resetPasswordFormValidation.confirmNewPasswordRequired")
    .test(
      "password-match",
      "resetPasswordFormValidation.passwordsMustMatch",
      function (value) {
        return value === this.parent.newPassword;
      }
    ),
});
