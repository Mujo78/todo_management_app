import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RefreshSessionFn } from "./api";
import { AxiosError } from "axios";
import useAuthStore, { LoginData } from "../../app/authSlice";

function useRefreshAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const {
    mutate: resumeSession,
    isPending,
    isError,
  } = useMutation<LoginData, Error | AxiosError, undefined>({
    mutationKey: ["refreshAuth"],
    mutationFn: RefreshSessionFn,
    onSuccess: (data: LoginData) => {
      setUser(data);
      navigate("/home");
    },
  });

  return { resumeSession, isError, isPending };
}

export default useRefreshAuth;
