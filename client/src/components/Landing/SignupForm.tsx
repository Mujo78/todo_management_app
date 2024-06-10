import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stack,
  Typography,
  TextField,
  Button,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { signupValidationSchema } from "../../validations/signupValidation";
import PasswordInput from "../UI/PasswordInput";
import { UserAccountDataType } from "../../features/user/api";
import useSignup from "../../features/user/useSignup";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
} from "../utils/userUtils";
import { Check } from "@mui/icons-material";

const SignupForm: React.FC = () => {
  const { control, formState, handleSubmit, reset } =
    useForm<UserAccountDataType>({
      resolver: yupResolver(signupValidationSchema),
    });
  const { errors } = formState;
  const { signup, isError, error, isPending, isSuccess } = useSignup();

  const onSubmit = (values: UserAccountDataType) => {
    signup(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        Sign up today!
      </Typography>
      <Stack
        component="form"
        width="80%"
        mx="auto"
        gap={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              label="Name"
              autoComplete="true"
              required
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
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
              required
              type="email"
              autoComplete="true"
              variant="standard"
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={
                errors.email ? (
                  errors.email.message
                ) : isError && !errors.email ? (
                  <FormHelperText component="span" error={isError}>
                    {formatErrorFieldMessage(error, "email")}
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
          defaultValue=""
          control={control}
          error={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <PasswordInput
          name="confirmPassword"
          defaultValue=""
          label="Confirm Password"
          control={control}
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        >
          {!errors.confirmPassword && (
            <FormHelperText component="span" error={isError}>
              {formatErrorMessage(error)}
            </FormHelperText>
          )}
        </PasswordInput>
        {isSuccess && (
          <Alert icon={<Check fontSize="inherit" />} severity="success">
            Please check your inbox for verification email.
          </Alert>
        )}
        <Button type="submit" sx={{ marginTop: "0.5rem" }} variant="contained">
          {isPending ? (
            <CircularProgress size={30} sx={{ color: "white" }} />
          ) : (
            "Register"
          )}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
