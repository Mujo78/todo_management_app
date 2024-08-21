import { Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { UserProfileUpdateType } from "../../../features/user/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileValidationSchema } from "../../../validations/user/editProfileValidation";
import useAuthStore, { UserType } from "../../../app/authSlice";
import { useCallback, useEffect } from "react";
import useUpdateProfile from "../../../features/user/useUpdateUserProfile";
import {
  formatErrorFieldMessage,
  isErrorForKey,
} from "../../../components/utils/user/userUtils";
import LoadingButton from "../../../components/UI/LoadingButton";
import { useTranslation } from "react-i18next";

const EditProfile = () => {
  const { t } = useTranslation();
  const { auth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserProfileUpdateType>({
    resolver: yupResolver(editProfileValidationSchema),
  });

  const { error, isPending, updateMyProfile } = useUpdateProfile();

  const onSubmit = (values: UserProfileUpdateType) => {
    if (isDirty) {
      const data = values as UserType;
      updateMyProfile(data);
    }
  };

  const memoizedReset = useCallback(() => {
    if (auth && auth.user) {
      reset(auth.user);
    }
  }, [auth, reset]);

  useEffect(() => {
    memoizedReset();
  }, [memoizedReset]);

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      gap={2}
      component="form"
      px={1}
      flexGrow={1}
    >
      <Controller
        control={control}
        name="name"
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            label={t("editProfile.name")}
            autoComplete="true"
            required
            type="text"
            fullWidth
            error={!!errors.name || isErrorForKey(error, "Name")}
            helperText={
              errors.name?.message
                ? t(errors.name.message)
                : isErrorForKey(error, "Name") &&
                  formatErrorFieldMessage(error, "Name")
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
            variant="outlined"
            label="Email"
            aria-label="Email"
            autoComplete="true"
            type="email"
            required
            fullWidth
            error={!!errors.email || isErrorForKey(error, "Email")}
            helperText={
              errors.email?.message
                ? t(errors.email.message)
                : !errors.email &&
                  isErrorForKey(error, "Email") &&
                  formatErrorFieldMessage(error, "Email")
            }
          />
        )}
      />

      <LoadingButton
        isPending={isPending}
        sx={{ flexGrow: { xs: 1, sm: 0 }, ml: { sm: "auto" } }}
      >
        {t("editProfile.saveBtn")}
      </LoadingButton>
    </Stack>
  );
};

export default EditProfile;
