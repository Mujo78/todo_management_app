import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../../validations/user/loginValidation";
import PasswordInput from "../../UI/PasswordInput";
import useLogin from "../../../features/auth/useLogin";
import { LogindDataType } from "../../../features/auth/api";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../../utils/user/userUtils";
import LoadingButton from "../../UI/LoadingButton";
import { Link } from "react-router-dom";
import useRefreshAuth from "../../../features/auth/useRefreshAuth";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const cookie = Cookies.get("checkToken");
  const { control, formState, handleSubmit, reset } = useForm<LogindDataType>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors, isDirty } = formState;

  const { error, isPending, login } = useLogin();
  const { isPending: isRefreshPending, resumeSession } = useRefreshAuth();

  const onSubmit = (values: LogindDataType) => {
    if (!isPending && isDirty) {
      login(values, { onSuccess: () => reset() });
    }
  };

  useEffect(() => {
    if (cookie) {
      resumeSession(undefined);
    }
  }, [cookie, resumeSession]);

  return (
    <Stack gap={4} my="auto" flexGrow={1}>
      <Typography
        variant="h4"
        fontWeight={700}
        mt={{ sm: 2 }}
        textAlign="center"
        role="title"
      >
        {t("loginForm.loginTitle")}
      </Typography>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        mx="auto"
        component="form"
        width={{ xs: "100%", lg: "70%" }}
      >
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              label="Email"
              id="Email"
              aria-label="Email"
              autoComplete="true"
              required
              disabled={isRefreshPending}
              type="email"
              fullWidth
              error={
                !!errors.email ||
                (isErrorForKey(error, "Email") &&
                  !isErrorForKey(error, "Incorrect"))
              }
              helperText={
                errors.email
                  ? errors.email.message
                  : isErrorForKey(error, "Email") &&
                    !isErrorForKey(error, "Incorrect") &&
                    formatErrorFieldMessage(error, "Email")
              }
            />
          )}
        />

        <PasswordInput
          control={control}
          label={t("loginForm.loginPassword")}
          name="password"
          disabled={isRefreshPending}
          defaultValue=""
          error={
            !!errors.password ||
            (isErrorForKey(error, "Password") &&
              !isErrorForKey(error, "Incorrect"))
          }
          errorMessage={errors.password?.message}
        >
          {!errors.password && (
            <FormHelperText component="span" error>
              {isErrorForKey(error, "Password")
                ? formatErrorFieldMessage(error, "Password")
                : formatErrorMessage(error)}
            </FormHelperText>
          )}
        </PasswordInput>

        <LoadingButton
          label="loginBtn"
          isPending={isPending || isRefreshPending}
          fullWidth
        >
          {t("loginForm.loginBtn")}
        </LoadingButton>
      </Stack>
      <Typography
        component={Link}
        sx={{ textDecoration: "none" }}
        to="/forgot-password"
        fontSize="small"
        aria-label="forgotPassword"
        mx="auto"
        role="link"
        color="primary.main"
      >
        {t("loginForm.forgotPassword")}
      </Typography>
    </Stack>
  );
};

export default LoginForm;
