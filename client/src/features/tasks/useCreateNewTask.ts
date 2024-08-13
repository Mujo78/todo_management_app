import { useMutation } from "@tanstack/react-query";
import { CreateTaskFn } from "./api";
import { AxiosError } from "axios";
import { CreateUpdateTaskType, TaskType } from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../components/utils/user/userUtils";

function useCreateTask() {
  const {
    mutate: createTask,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation<TaskType, Error | AxiosError, CreateUpdateTaskType>({
    mutationKey: ["createTask"],
    mutationFn: CreateTaskFn,
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && !errorToShow.includes("title")) {
        toast.error(errorToShow);
      }
    },
  });

  return { createTask, error, isError, isPending, isSuccess };
}

export default useCreateTask;
