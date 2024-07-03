import { useMutation } from "@tanstack/react-query";
import { UpdateTaskArgs, UpdateTaskFn } from "./api";
import { AxiosError } from "axios";
import { TaskType } from "../../app/taskSlice";
import toast from "react-hot-toast";
import {
  formatErrorMessage,
  isErrorForKey,
} from "../../components/utils/userUtils";

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
      if (
        formatErrorMessage(error) !== undefined &&
        !isErrorForKey(error, "Title")
      ) {
        toast.error(formatErrorMessage(error));
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
