import { useMutation } from "@tanstack/react-query";
import { UpdateTaskArgs, UpdateTaskFn } from "./api";
import { AxiosError } from "axios";
import { TaskType } from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage, isErrorForKey } from "../../utils/user/userUtils";

function useUpdateTask() {
  const {
    mutate: updateTask,
    isPending: isUpdating,
    isError: isUpdatingError,
    isSuccess: isUpdatingSuccess,
    error: errorUpdate,
  } = useMutation<TaskType, Error | AxiosError, UpdateTaskArgs>({
    mutationKey: ["updateTask"],
    mutationFn: UpdateTaskFn,
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);
      if (errorToShow !== undefined && !isErrorForKey(error, "Title")) {
        toast.error(errorToShow);
      }
    },
  });

  return {
    updateTask,
    errorUpdate,
    isUpdatingError,
    isUpdating,
    isUpdatingSuccess,
  };
}

export default useUpdateTask;
