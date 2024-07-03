import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../validations/loginValidation";
import PasswordInput from "../UI/PasswordInput";
import useLogin from "../../features/auth/useLogin";
import { LogindDataType } from "../../features/auth/api";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../utils/userUtils";
import LoadingButton from "../UI/LoadingButton";

const LoginForm: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<LogindDataType>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors, isDirty } = formState;

  const { error, isPending, login } = useLogin();

  const onSubmit = (values: LogindDataType) => {
    if (!isPending && isDirty) {
      login(values);
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h4" fontWeight={700} mt={2} textAlign="center">
        Log in to You Account
      </Typography>
      <Stack
        onSubmit={handleSubmit(onSubmit)}
        gap={2}
        component="form"
        width="80%"
        mx="auto"
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
              autoComplete="true"
              required
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
          name="password"
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

        <LoadingButton isPending={isPending} fullWidth>
          Log in
        </LoadingButton>
      </Stack>
      <Typography
        component="a"
        sx={{ textDecoration: "none" }}
        href="/forgot-password"
        fontSize="small"
        mx="auto"
        color="primary.main"
      >
        Forgot Password?
      </Typography>
    </Stack>
  );
};

export default LoginForm;
