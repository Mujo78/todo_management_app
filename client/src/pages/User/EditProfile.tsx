import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { UserProfileUpdateType } from "../../features/user/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileValidationSchema } from "../../validations/editProfileValidation";
import useAuthStore, { UserType } from "../../app/authSlice";
import { useEffect } from "react";
import useUpdateProfile from "../../features/user/useUpdateUserProfile";
import {
  formatErrorFieldMessage,
  isErrorForKey,
} from "../../components/utils/userUtils";

const EditProfile = () => {
  const { auth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserProfileUpdateType>({
    resolver: yupResolver(editProfileValidationSchema),
  });

  const { error, isError, isPending, updateMyProfile } = useUpdateProfile();

  const onSubmit = (values: UserProfileUpdateType) => {
    if (isDirty) {
      const data = values as UserType;
      updateMyProfile(data);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      reset(auth.user);
    }
  }, [auth, reset]);

  return (
    <Stack
      onSubmit={handleSubmit(onSubmit)}
      gap={2}
      component="form"
      width="100%"
      mx="auto"
    >
      <Controller
        control={control}
        name="name"
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            label="Name/Username"
            autoComplete="true"
            required
            type="text"
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
            variant="outlined"
            label="Email"
            autoComplete="true"
            required
            type="email"
            fullWidth
            error={!!errors.email || isErrorForKey(error, "email")}
            helperText={
              errors.email
                ? errors.email.message
                : isError && !errors.email
                ? formatErrorFieldMessage(error, "email")
                : ""
            }
          />
        )}
      />

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

export default EditProfile;
