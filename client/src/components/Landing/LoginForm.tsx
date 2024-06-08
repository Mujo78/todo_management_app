import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { loginValidationSchema } from "../../validations/loginValidation";
import PasswordInput from "../UI/PasswordInput";

type User = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<User>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors } = formState;

  const onSubmit = (value: User) => {
    console.log(value);
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
        />
        <Button sx={{ marginTop: "2rem" }} type="submit" variant="contained">
          Log in
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginForm;
