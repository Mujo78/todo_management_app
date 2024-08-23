import * as Yup from "yup";

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .required("forgotPasswordFormValidation.emailRequired")
    .email("forgotPasswordFormValidation.emailValid"),
});
