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
} from "../../utils/user/userUtils";
import SuccessAlert from "../../UI/SuccessAlert";
import LoadingButton from "../../UI/LoadingButton";

const SignupForm: React.FC = () => {
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
        Sign up today!
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
              label="Name"
              required
              autoComplete="true"
              fullWidth
              error={!!errors.name || isErrorForKey(error, "Name")}
              helperText={
                errors.name
                  ? errors.name.message
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
              required
              type="email"
              fullWidth
              error={!!errors.email || isErrorForKey(error, "Email")}
              helperText={
                errors.email ? (
                  errors.email.message
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
          defaultValue=""
          control={control}
          error={
            !!errors.password ||
            (isErrorForKey(error, "Password") &&
              !isErrorForKey(error, "Confirm Password"))
          }
          errorMessage={errors.password?.message}
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
          label="Confirm Password"
          control={control}
          error={
            !!errors.confirmPassword || isErrorForKey(error, "ConfirmPassword")
          }
          errorMessage={errors.confirmPassword?.message}
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
          Please check your inbox for verification email.
        </SuccessAlert>

        <LoadingButton fullWidth isPending={isPending}>
          Register
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default SignupForm;
