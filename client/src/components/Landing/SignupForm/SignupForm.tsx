import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography, TextField, FormHelperText } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { signupValidationSchema } from "../../../validations/user/signupValidation";
import PasswordInput from "../../UI/PasswordInput";
import { UserAccountDataType } from "../../../features/user/api";
import useSignup from "../../../features/user/useSignup";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../../../utils/user/userUtils";
import SuccessAlert from "../../UI/SuccessAlert";
import LoadingButton from "../../UI/LoadingButton";
import { useTranslation } from "react-i18next";

const SignupForm: React.FC = () => {
  const { t } = useTranslation();

  const { control, formState, handleSubmit, reset } =
    useForm<UserAccountDataType>({
      resolver: yupResolver(signupValidationSchema),
    });
  const { errors, isDirty } = formState;
  const { signup, error, isError, isPending, isSuccess } = useSignup();

  const onSubmit = (values: UserAccountDataType) => {
    if (!isPending && isDirty) {
      signup(values, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  return (
    <Stack gap={4} my="auto" flexGrow={1}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        {t("signupForm.signupTitle")}
      </Typography>
      <Stack
        component="form"
        width={{ xs: "100%", md: "90%", lg: "80%", xl: "65%" }}
        gap={2}
        mx="auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              label={t("signupForm.signupName")}
              id="Name"
              aria-label="Name"
              required
              autoComplete="true"
              fullWidth
              error={!!errors.name || isErrorForKey(error, "Name")}
              helperText={
                errors.name?.message
                  ? t(errors.name.message)
                  : isErrorForKey(error, "Name") &&
                    !errors.name && (
                      <FormHelperText component="span" error>
                        {formatErrorFieldMessage(error, "Name")}
                      </FormHelperText>
                    )
              }
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              autoComplete="true"
              variant="outlined"
              label="Email"
              id="Email"
              aria-label="Email"
              required
              type="email"
              fullWidth
              error={!!errors.email || isErrorForKey(error, "Email")}
              helperText={
                errors.email?.message ? (
                  t(errors.email.message)
                ) : isErrorForKey(error, "Email") && !errors.email ? (
                  <FormHelperText component="span" error>
                    {formatErrorFieldMessage(error, "Email")}
                  </FormHelperText>
                ) : (
                  ""
                )
              }
            />
          )}
        />

        <PasswordInput
          name="password"
          label={t("signupForm.signupPassword")}
          defaultValue=""
          control={control}
          error={
            !!errors.password ||
            (isErrorForKey(error, "Password") &&
              !isErrorForKey(error, "Confirm Password"))
          }
          errorMessage={errors.password?.message && t(errors.password.message)}
        >
          {!errors.password &&
            isErrorForKey(error, "Password") &&
            !isErrorForKey(error, "Confirm Password") && (
              <FormHelperText component="span" error>
                {formatErrorFieldMessage(error, "Password")}
              </FormHelperText>
            )}
        </PasswordInput>

        <PasswordInput
          name="confirmPassword"
          defaultValue=""
          label={t("signupForm.signupConfirmPassword")}
          control={control}
          error={
            !!errors.confirmPassword || isErrorForKey(error, "ConfirmPassword")
          }
          errorMessage={
            errors.confirmPassword?.message && t(errors.confirmPassword.message)
          }
        >
          {!errors.confirmPassword &&
            isError &&
            !isErrorForKey(error, "Email") && (
              <FormHelperText component="span" error>
                {isErrorForKey(error, "ConfirmPassword")
                  ? formatErrorFieldMessage(error, "ConfirmPassword")
                  : formatErrorMessage(error)}
              </FormHelperText>
            )}
        </PasswordInput>

        <SuccessAlert isSuccess={isSuccess}>
          {t("signupForm.successMessage")}
        </SuccessAlert>

        <LoadingButton label="signupBtn" fullWidth isPending={isPending}>
          {t("signupForm.signupBtn")}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
