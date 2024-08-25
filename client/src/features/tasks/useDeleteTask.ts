import { useMutation } from "@tanstack/react-query";
import { DeleteTaskFn } from "./api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import { useTranslation } from "react-i18next";

function useDeleteTask() {
  const { t } = useTranslation();
  const { mutate: deleteTask, isPending } = useMutation<
    string,
    Error | AxiosError,
    string
  >({
    mutationKey: ["deleteTask"],
    mutationFn: DeleteTaskFn,
    onSuccess: () => {
      toast.success(t("deleteTaskModal.successMessage"));
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);
      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { deleteTask, isPending };
}

export default useDeleteTask;
