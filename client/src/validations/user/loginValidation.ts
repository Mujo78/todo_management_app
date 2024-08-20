import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required("loginFormValidation.emailRequired")
    .email("loginFormValidation.emailValid"),
  password: Yup.string().required("loginFormValidation.passwordRequired"),
});
