import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ResetPasswordFn, ResetPasswordType } from "./api";

function useResetPassword() {
  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<
    unknown,
    Error | AxiosError<unknown, unknown>,
    [string, ResetPasswordType]
  >({
    mutationKey: ["resetPassword"],
    mutationFn: ResetPasswordFn,
  });

  return { resetPassword, error, isError, isPending, isSuccess };
}

export default useResetPassword;
