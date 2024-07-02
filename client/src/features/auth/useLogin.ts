import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogindDataType, UserLoginFn } from "./api";
import { AxiosError } from "axios";
import useAuthStore, { LoginData } from "../../app/authSlice";

function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation<LoginData, Error | AxiosError, LogindDataType>({
    mutationKey: ["login"],
    mutationFn: UserLoginFn,
    onSuccess: (data: LoginData) => {
      setUser(data);
      navigate("/home");
    },
  });

  return { login, error, isPending };
}

export default useLogin;
