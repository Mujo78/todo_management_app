import { useMutation } from "@tanstack/react-query";
import { DeleteSelectedTaskFn } from "./api";
import { AxiosError } from "axios";
import useTaskStore from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import { useTranslation } from "react-i18next";

function useDeleteSelectedTasks() {
  const { t } = useTranslation();
  const { removeSelectedTasks } = useTaskStore();

  const { mutate: deleteSelectedTasks, isPending } = useMutation<
    unknown,
    Error | AxiosError,
    string[]
  >({
    mutationKey: ["deleteSelectedTasks"],
    mutationFn: DeleteSelectedTaskFn,
    onSuccess: () => {
      toast.success(t("deleteTasksService"));
      removeSelectedTasks();
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { deleteSelectedTasks, isPending };
}

export default useDeleteSelectedTasks;
