import { Button, CircularProgress, FormHelperText, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { ChangePasswordType } from "../../features/user/api";
import { changePasswordValidationSchema } from "../../validations/changePassword";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "../../components/UI/PasswordInput";
import useChangePassword from "../../features/user/useChangePassword";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../../components/utils/userUtils";

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: yupResolver(changePasswordValidationSchema),
  });

  const { changePassword, error, isPending } = useChangePassword();

  const onSubmit = (values: ChangePasswordType) => {
    if (isDirty) {
      changePassword(values, { onSuccess: () => reset() });
    }
  };

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      gap={4}
      component="form"
      width="100%"
      mx="auto"
    >
      <PasswordInput
        control={control}
        defaultValue=""
        name="oldPassword"
        label="Password"
        error={
          !!errors.oldPassword ||
          ((isErrorForKey(error, "old password") ||
            isErrorForKey(error, "OldPassword")) &&
            !isErrorForKey(error, "new password"))
        }
        errorMessage={errors.oldPassword?.message}
      >
        {!errors.oldPassword &&
          (isErrorForKey(error, "old password") ||
            isErrorForKey(error, "OldPassword")) &&
          !isErrorForKey(error, "new password") && (
            <FormHelperText component="span">
              {formatErrorMessage(error) ||
                formatErrorFieldMessage(error, "OldPassword")}
            </FormHelperText>
          )}
      </PasswordInput>

      <PasswordInput
        control={control}
        defaultValue=""
        name="newPassword"
        label="New Password"
        error={
          !!errors.newPassword ||
          isErrorForKey(error, "new password") ||
          isErrorForKey(error, "NewPassword")
        }
        errorMessage={errors.newPassword?.message}
      >
        {!errors.newPassword &&
          (isErrorForKey(error, "new password") ||
            isErrorForKey(error, "NewPassword")) && (
            <FormHelperText component="span">
              {formatErrorMessage(error) ||
                formatErrorFieldMessage(error, "NewPassword")}
            </FormHelperText>
          )}
      </PasswordInput>

      <PasswordInput
        control={control}
        defaultValue=""
        name="confirmNewPassword"
        label="Confirm New Password"
        error={
          !!errors.confirmNewPassword ||
          isErrorForKey(error, "ConfirmNewPassword")
        }
        errorMessage={errors.confirmNewPassword?.message}
      >
        {!errors.confirmNewPassword &&
          isErrorForKey(error, "ConfirmNewPassword") && (
            <FormHelperText component="span">
              {formatErrorMessage(error) ||
                formatErrorFieldMessage(error, "ConfirmNewPassword")}
            </FormHelperText>
          )}
      </PasswordInput>
      <Button
        type="submit"
        variant="contained"
        sx={{ width: "fit-content", marginLeft: "auto" }}
      >
        {isPending ? (
          <CircularProgress size={30} sx={{ color: "white" }} />
        ) : (
          "Save changes"
        )}
      </Button>
    </Stack>
  );
};

export default ChangePassword;
