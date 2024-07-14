import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../validations/user/loginValidation";
import PasswordInput from "../UI/PasswordInput";
import useLogin from "../../features/auth/useLogin";
import { LogindDataType } from "../../features/auth/api";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../utils/user/userUtils";
import LoadingButton from "../UI/LoadingButton";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { control, formState, handleSubmit, reset } = useForm<LogindDataType>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors, isDirty } = formState;

  const { error, isPending, login } = useLogin();

  const onSubmit = (values: LogindDataType) => {
    if (!isPending && isDirty) {
      login(values, { onSuccess: () => reset() });
    }
  };

  return (
    <Stack gap={4} my="auto" flexGrow={1}>
      <Typography
        variant="h4"
        fontWeight={700}
        mt={{ sm: 2 }}
        textAlign="center"
      >
        Log in to Your Account
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
        component={Link}
        sx={{ textDecoration: "none" }}
        to="/forgot-password"
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
