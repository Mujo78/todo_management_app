import React from "react";
import { resetPasswordValidationSchema } from "../../validations/resetPasswordValidation";
import { useParams } from "react-router-dom";
import { ResetPasswordType } from "../../features/user/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useResetPassword from "../../features/user/useResetPassword";
import { Button, CircularProgress, FormHelperText, Stack } from "@mui/material";
import PasswordInput from "../UI/PasswordInput";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../utils/userUtils";
import SuccessAlert from "../UI/SuccessAlert";

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams();
  const { control, formState, handleSubmit, reset } =
    useForm<ResetPasswordType>({
      resolver: yupResolver(resetPasswordValidationSchema),
    });
  const { errors, isDirty } = formState;

  const { error, isPending, resetPassword, isSuccess } = useResetPassword();

  const onSubmit = (values: ResetPasswordType) => {
    if (!isPending && token !== undefined && isDirty) {
      resetPassword([token, values], { onSuccess: () => reset() });
    }
  };

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      gap={2}
      component="form"
      width="40%"
      mx="auto"
    >
      <PasswordInput
        control={control}
        label="New Password"
        name="newPassword"
        defaultValue=""
        error={!!errors.newPassword || isErrorForKey(error, "NewPassword")}
        errorMessage={errors.newPassword?.message}
      >
        {!errors.newPassword && isErrorForKey(error, "NewPassword") && (
          <FormHelperText component="span" error>
            {formatErrorFieldMessage(error, "NewPassword")}
          </FormHelperText>
        )}
      </PasswordInput>

      <PasswordInput
        label="Confirm Password"
        control={control}
        name="confirmNewPassword"
        defaultValue=""
        error={
          !!errors.confirmNewPassword ||
          isErrorForKey(error, "ConfirmNewPassword")
        }
        errorMessage={errors.confirmNewPassword?.message}
      >
        {!errors.confirmNewPassword ? (
          <FormHelperText component="span" error>
            {isErrorForKey(error, "ConfirmNewPassword")
              ? formatErrorFieldMessage(error, "ConfirmNewPassword")
              : formatErrorMessage(error)}
          </FormHelperText>
        ) : (
          ""
        )}
      </PasswordInput>

      <SuccessAlert isSuccess={isSuccess}>
        Password successfully changed.
      </SuccessAlert>

      <Button type="submit" variant="contained">
        {isPending ? (
          <CircularProgress size={30} sx={{ color: "white" }} />
        ) : (
          "Submit"
        )}
      </Button>
    </Stack>
  );
};

export default ResetPasswordForm;
