import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserLogoutFn } from "./api";
import { AxiosError } from "axios";
import useAuthStore from "../../app/authSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";

function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const { mutate: userLogout, isPending } = useMutation<
    unknown,
    Error | AxiosError
  >({
    mutationKey: ["logout"],
    mutationFn: UserLogoutFn,
    onSuccess: () => {
      logout();
      navigate("/");
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { userLogout, isPending };
}

export default useLogout;
