import * as Yup from "yup";

export const editProfileValidationSchema = Yup.object({
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
});
