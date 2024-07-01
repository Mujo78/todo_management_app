import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChangePasswordFn, ChangePasswordType } from "./api";
import {
  formatErrorMessage,
  isErrorForKey,
} from "../../components/utils/userUtils";
import toast from "react-hot-toast";

function useChangePassword() {
  const {
    mutate: changePassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<
    string,
    Error | AxiosError<unknown, unknown>,
    ChangePasswordType
  >({
    mutationKey: ["changePassword"],
    mutationFn: ChangePasswordFn,
    onSuccess: () => {
      toast.success("Password successfully changed.");
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && !isErrorForKey(error, "password")) {
        toast.error(errorToShow);
      }
    },
  });

  return { changePassword, error, isError, isPending, isSuccess };
}

export default useChangePassword;
