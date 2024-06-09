import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../validations/loginValidation";
import PasswordInput from "../UI/PasswordInput";
import useLogin from "../../features/auth/useLogin";
import { LogindDataType } from "../../features/auth/api";
import { formatErrorMessage } from "../utils/userUtils";

const LoginForm: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<LogindDataType>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors } = formState;

  const { error, isPending, isError, login } = useLogin();

  const onSubmit = (values: LogindDataType) => {
    if (!isPending) {
      login(values);
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h4" fontWeight={700} mt={2} textAlign="center">
        Log in to You Account
      </Typography>
      <Stack
        gap={2}
        component="form"
        width="80%"
        mx="auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              label="Email"
              autoComplete="true"
              required
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />

        <PasswordInput
          control={control}
          name="password"
          defaultValue=""
          error={!!errors.password}
          errorMessage={errors.password?.message}
        >
          {!errors.password && (
            <FormHelperText component="span" error={isError}>
              {formatErrorMessage(error)}
            </FormHelperText>
          )}
        </PasswordInput>

        <Button sx={{ marginTop: "0.5rem" }} type="submit" variant="contained">
          {isPending ? (
            <CircularProgress size={30} sx={{ color: "white" }} />
          ) : (
            "Log in"
          )}
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginForm;
