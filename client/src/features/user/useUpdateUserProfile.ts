import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UpdateProfileFn } from "./api";
import useAuthStore, { UserType } from "../../app/authSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import { useTranslation } from "react-i18next";

function useUpdateProfile() {
  const { t } = useTranslation();
  const { updateUserInfo } = useAuthStore();
  const {
    mutate: updateMyProfile,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<UserType, Error | AxiosError<unknown, unknown>, UserType>({
    mutationKey: ["updateProfile"],
    mutationFn: UpdateProfileFn,
    onSuccess: (data) => {
      updateUserInfo(data);
      toast.success(t("editProfileFormValidation.successMessage"));
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { updateMyProfile, error, isError, isPending, isSuccess };
}

export default useUpdateProfile;
