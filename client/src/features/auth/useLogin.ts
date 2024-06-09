import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogindDataType, UserLoginFn } from "./api";
import { AxiosError } from "axios";

function useLogin() {
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useMutation<unknown, Error | AxiosError, LogindDataType>({
    mutationKey: ["login"],
    mutationFn: UserLoginFn,
    onSuccess: () => {
      navigate("/home");
    },
  });

  return { login, error, isError, isPending };
}

export default useLogin;
