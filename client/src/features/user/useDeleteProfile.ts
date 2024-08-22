import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DeleteMyProfileFn } from "./api";
import { formatErrorMessage } from "../../utils/user/userUtils";
import toast from "react-hot-toast";
import useAuthStore from "../../app/authSlice";

function useDeleteProfile() {
  const { logout } = useAuthStore();

  const { mutate: deleteProfile, isPending } = useMutation<
    string,
    Error | AxiosError<unknown, unknown>,
    undefined
  >({
    mutationKey: ["deleteMyProfile"],
    mutationFn: DeleteMyProfileFn,
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined) {
        toast.error(errorToShow);
      }
    },
  });

  return { deleteProfile, isPending };
}

export default useDeleteProfile;
