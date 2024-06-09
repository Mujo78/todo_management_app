import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserAccountDataType, UserSignupFn } from "./api";

function useSignup() {
  const {
    mutate: signup,
    isPending,
    isError,
    error,
  } = useMutation<
    unknown,
    Error | AxiosError<unknown, unknown>,
    UserAccountDataType
  >({
    mutationKey: ["signup"],
    mutationFn: UserSignupFn,
  });

  return { signup, error, isError, isPending };
}

export default useSignup;
