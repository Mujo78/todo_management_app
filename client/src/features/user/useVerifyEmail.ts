import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { VerifyEmailFn } from "./api";

function useVerifyEmail() {
  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation<unknown, Error | AxiosError<unknown, unknown>, string>({
    mutationKey: ["verifyEmail"],
    mutationFn: VerifyEmailFn,
    retry: 0,
  });

  return { verifyEmail, error, isError, isPending, isSuccess };
}

export default useVerifyEmail;
