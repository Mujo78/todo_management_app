import { useMutation } from "@tanstack/react-query";
import { MakeTaskFinishedFn } from "./api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import useTaskStore from "../../app/taskSlice";

function useMakeTasksFinished() {
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
      toast.success("Tasks successfully completed.");
      makeTasksFinished();
    },
    onError: (error) => {
      toast.error(formatErrorMessage(error));
    },
  });

  return { finishTasks, error, isError, isPending, isSuccess };
}

export default useMakeTasksFinished;
