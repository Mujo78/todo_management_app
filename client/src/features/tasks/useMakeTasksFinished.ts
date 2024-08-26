import { useMutation } from "@tanstack/react-query";
import { MakeTaskFinishedFn } from "./api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import useTaskStore from "../../app/taskSlice";
import { useTranslation } from "react-i18next";

function useMakeTasksFinished() {
  const { t } = useTranslation();
  const { makeTasksFinished } = useTaskStore();
  const {
    mutate: finishTasks,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation<string, Error | AxiosError, string[]>({
    mutationKey: ["makeTasksFinished"],
    mutationFn: MakeTaskFinishedFn,
    onSuccess: () => {
      toast.success(t("finishTasksService"));
      makeTasksFinished();
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { finishTasks, error, isError, isPending, isSuccess };
}

export default useMakeTasksFinished;
