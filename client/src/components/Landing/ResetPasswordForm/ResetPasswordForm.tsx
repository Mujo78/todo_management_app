import React from "react";
import { resetPasswordValidationSchema } from "../../../validations/user/resetPasswordValidation";
import { useParams } from "react-router-dom";
import { ResetPasswordType } from "../../../features/user/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useResetPassword from "../../../features/user/useResetPassword";
import { FormHelperText, Stack } from "@mui/material";
import PasswordInput from "../../UI/PasswordInput";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "../../../utils/user/userUtils";
import SuccessAlert from "../../UI/SuccessAlert";
import LoadingButton from "../../UI/LoadingButton";
import { useTranslation } from "react-i18next";

const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const { control, formState, handleSubmit, reset } =
    useForm<ResetPasswordType>({
      resolver: yupResolver(resetPasswordValidationSchema),
    });
  const { errors, isDirty } = formState;

  const { error, isPending, isError, resetPassword, isSuccess } =
    useResetPassword();

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
      width={{ xs: "90%", sm: "80%", md: "60%", lg: "40%" }}
      mx="auto"
    >
      <PasswordInput
        control={control}
        label={t("resetPasswordForm.newPassword")}
        name="newPassword"
        defaultValue=""
        error={!!errors.newPassword || isErrorForKey(error, "NewPassword")}
        errorMessage={
          errors.newPassword?.message && t(errors.newPassword.message)
        }
      >
        {!errors.newPassword && isErrorForKey(error, "NewPassword") && (
          <FormHelperText component="span" error>
            {formatErrorFieldMessage(error, "NewPassword")}
          </FormHelperText>
        )}
      </PasswordInput>

      <PasswordInput
        label={t("resetPasswordForm.confirmNewPassword")}
        control={control}
        name="confirmNewPassword"
        defaultValue=""
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
          (isError || isErrorForKey(error, "ConfirmNewPassword")) && (
            <FormHelperText component="span" error>
              {isErrorForKey(error, "ConfirmNewPassword")
                ? formatErrorFieldMessage(error, "ConfirmNewPassword")
                : formatErrorMessage(error)}
            </FormHelperText>
          )}
      </PasswordInput>

      <SuccessAlert isSuccess={isSuccess}>
        {t("resetPasswordForm.successMessage")}
      </SuccessAlert>

      <LoadingButton isPending={isPending}>
        {t("resetPasswordForm.submitBtn")}
      </LoadingButton>
    </Stack>
  );
};

export default ResetPasswordForm;
