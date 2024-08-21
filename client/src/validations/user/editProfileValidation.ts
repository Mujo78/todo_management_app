import * as Yup from "yup";

export const editProfileValidationSchema = Yup.object({
  name: Yup.string()
    .required("editProfileFormValidation.nameRequired")
    .min(5, "editProfileFormValidation.nameLength"),
  email: Yup.string()
    .required("editProfileFormValidation.emailRequired")
    .email("editProfileFormValidation.emailValid")
    .test(
      "email-validation",
      "editProfileFormValidation.invalidEmailWord",
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
