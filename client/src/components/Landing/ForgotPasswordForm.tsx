import React from "react";
import {
  Button,
  CircularProgress,
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
import { formatErrorMessage } from "../utils/userUtils";
import SuccessAlert from "../UI/SuccessAlert";

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { control, formState, handleSubmit, reset } =
    useForm<ForgotPasswordType>({
      resolver: yupResolver(forgotPasswordValidationSchema),
    });
  const { errors } = formState;

  const { error, isPending, isError, forgotPassword, isSuccess } =
    useForgotPassword();

  const onSubmit = (values: ForgotPasswordType) => {
    if (!isPending) {
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
              autoComplete="true"
              required
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={
                errors.email ? (
                  errors.email.message
                ) : isError && !errors.email ? (
                  <FormHelperText component="span" error={isError}>
                    {formatErrorMessage(error)}
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

        <Button sx={{ marginTop: "1rem" }} type="submit" variant="contained">
          {isPending ? (
            <CircularProgress size={30} sx={{ color: "white" }} />
          ) : (
            "SUBMIT"
          )}
        </Button>
        <Button
          onClick={handleNavigate}
          sx={{ marginTop: "0.5rem" }}
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
