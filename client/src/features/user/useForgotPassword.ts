import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ForgotPasswordFn, ForgotPasswordType } from "./api";

function useForgotPassword() {
  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<
    unknown,
    Error | AxiosError<unknown, unknown>,
    ForgotPasswordType
  >({
    mutationKey: ["forgotPassword"],
    mutationFn: ForgotPasswordFn,
  });

  return { forgotPassword, error, isError, isPending, isSuccess };
}

export default useForgotPassword;
