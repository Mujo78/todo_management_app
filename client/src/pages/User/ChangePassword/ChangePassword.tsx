import { FormHelperText, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { ChangePasswordType } from "../../../features/user/api";
import { changePasswordValidationSchema } from "../../../validations/user/changePassword";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "../../../components/UI/PasswordInput";
import useChangePassword from "../../../features/user/useChangePassword";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../../../utils/user/userUtils";
import LoadingButton from "../../../components/UI/LoadingButton";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();
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
      gap={2}
      px={1}
      component="form"
      flexGrow={1}
    >
      <PasswordInput
        control={control}
        defaultValue=""
        name="oldPassword"
        label={t("changePassword.password")}
        error={
          !!errors.oldPassword ||
          isErrorForKey(error, t("changePasswordService.oldPassword")) ||
          isErrorForKey(error, "OldPassword")
        }
        errorMessage={
          errors.oldPassword?.message && t(errors.oldPassword.message)
        }
      >
        {!errors.oldPassword &&
          (isErrorForKey(error, t("changePasswordService.oldPassword")) ||
            isErrorForKey(error, "OldPassword")) &&
          !isErrorForKey(error, t("changePasswordService.newPassword")) && (
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
        label={t("changePassword.newPassword")}
        error={
          !!errors.newPassword ||
          isErrorForKey(error, t("changePasswordService.newPassword")) ||
          isErrorForKey(error, "NewPassword")
        }
        errorMessage={
          errors.newPassword?.message && t(errors.newPassword.message)
        }
      >
        {!errors.newPassword &&
          (isErrorForKey(error, t("changePasswordService.newPassword")) ||
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
        label={t("changePassword.confirmNewPassword")}
        error={
          !!errors.confirmNewPassword ||
          isErrorForKey(error, "ConfirmNewPassword")
        }
        errorMessage={
          errors.confirmNewPassword?.message &&
          t(errors.confirmNewPassword.message)
        }
      >
        {!errors.confirmNewPassword &&
          isErrorForKey(error, "ConfirmNewPassword") && (
            <FormHelperText component="span">
              {formatErrorMessage(error) ||
                formatErrorFieldMessage(error, "ConfirmNewPassword")}
            </FormHelperText>
          )}
      </PasswordInput>

      <LoadingButton
        isPending={isPending}
        sx={{ flexGrow: { xs: 1, sm: 0 }, ml: { sm: "auto" } }}
      >
        {t("changePassword.saveBtn")}
      </LoadingButton>
    </Stack>
  );
};

export default ChangePassword;
