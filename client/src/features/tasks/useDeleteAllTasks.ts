import { useMutation } from "@tanstack/react-query";
import { DeleteAllTaskFn } from "./api";
import { AxiosError } from "axios";
import useTaskStore from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import { useTranslation } from "react-i18next";

function useDeleteAllTasks() {
  const { t } = useTranslation();
  const { initialize } = useTaskStore();

  const { mutate: deleteAllTasks, isPending } = useMutation<
    unknown,
    Error | AxiosError,
    undefined
  >({
    mutationKey: ["deleteAllTasks"],
    mutationFn: DeleteAllTaskFn,
    onSuccess: () => {
      toast.success(t("deleteTasksService"));
      initialize();
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { deleteAllTasks, isPending };
}

export default useDeleteAllTasks;
