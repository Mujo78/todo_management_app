import { useMutation } from "@tanstack/react-query";
import { CreateTaskFn } from "./api";
import { AxiosError } from "axios";
import { CreateTaskType, TaskType } from "../../app/taskSlice";
import toast from "react-hot-toast";

function useCreateTask() {
  const {
    mutate: createTask,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation<TaskType, Error | AxiosError, CreateTaskType>({
    mutationKey: ["createTask"],
    mutationFn: CreateTaskFn,
    onSuccess: () => {
      toast.success("Successfully created a new task.");
    },
  });

  return { createTask, error, isError, isPending, isSuccess };
}

export default useCreateTask;
