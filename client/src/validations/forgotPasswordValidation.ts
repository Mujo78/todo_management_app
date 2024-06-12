import * as Yup from "yup";

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .email("Please provide a valid email address"),
});
