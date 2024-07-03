import React from "react";
import {
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ForgotPasswordType } from "../../features/user/api";
import { forgotPasswordValidationSchema } from "../../validations/forgotPasswordValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import useForgotPassword from "../../features/user/useForgotPassword";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../utils/userUtils";
import SuccessAlert from "../UI/SuccessAlert";
import LoadingButton from "../UI/LoadingButton";

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { control, formState, handleSubmit, reset } =
    useForm<ForgotPasswordType>({
      resolver: yupResolver(forgotPasswordValidationSchema),
    });
  const { errors, isDirty } = formState;

  const { error, isPending, isError, forgotPassword, isSuccess } =
    useForgotPassword();

  const onSubmit = (values: ForgotPasswordType) => {
    if (!isPending && isDirty) {
      forgotPassword(values, { onSuccess: () => reset() });
    }
  };

  const handleNavigate = () => {
    navigate("/?tab=login");
  };

  return (
    <Stack gap={4}>
      <Typography variant="h4" fontWeight={700} mt={2} textAlign="center">
        Forgot Your Password?
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
              variant="outlined"
              label="Email"
              sx={{ mb: "1rem" }}
              autoComplete="true"
              required
              type="email"
              fullWidth
              error={!!errors.email || isErrorForKey(error, "Email")}
              helperText={
                errors.email ? (
                  errors.email.message
                ) : !errors.email &&
                  (isErrorForKey(error, "Email") || isError) ? (
                  <FormHelperText component="span" error>
                    {isErrorForKey(error, "Email")
                      ? formatErrorFieldMessage(error, "Email")
                      : formatErrorMessage(error)}
                  </FormHelperText>
                ) : (
                  ""
                )
              }
            />
          )}
        />

        <SuccessAlert isSuccess={isSuccess}>
          Please check your inbox for reset password link.
        </SuccessAlert>

        <LoadingButton isPending={isPending} fullWidth>
          Submit
        </LoadingButton>
        <Button
          onClick={handleNavigate}
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Log In page
        </Button>
      </Stack>
    </Stack>
  );
};

export default ForgotPasswordForm;
