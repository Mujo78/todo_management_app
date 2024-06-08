import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Typography, TextField, Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { signupValidationSchema } from "../../validations/signupValidation";
import PasswordInput from "../UI/PasswordInput";

type UserAccount = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<UserAccount>({
    resolver: yupResolver(signupValidationSchema),
  });
  const { errors } = formState;

  const onSubmit = (value: UserAccount) => {
    console.log(value);
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
              helperText={errors.email ? errors.email.message : ""}
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
        />

        <Button type="submit" sx={{ marginTop: "2rem" }} variant="contained">
          Register
        </Button>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
