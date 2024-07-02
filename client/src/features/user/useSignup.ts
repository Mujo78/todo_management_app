import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserAccountDataType, UserSignupFn } from "./api";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../components/utils/userUtils";

function useSignup() {
  const {
    mutate: signup,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<
    unknown,
    Error | AxiosError<unknown, unknown>,
    UserAccountDataType
  >({
    mutationKey: ["signup"],
    mutationFn: UserSignupFn,
    onError: (error) => {
      const errorToShow: string = formatErrorMessage(error);
      if (
        !errorToShow.toLowerCase().includes("email") &&
        !errorToShow.toLowerCase().includes("password")
      )
        toast.error(errorToShow);
    },
  });

  return { signup, error, isError, isPending, isSuccess };
}

export default useSignup;
