import { useMutation } from "@tanstack/react-query";
import { MakeTaskFailedFn } from "./api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";
import useTaskStore, { TaskType } from "../../app/taskSlice";

function useMakeTaskFailed() {
  const { updateExpiredTask } = useTaskStore();
  const { mutate: failTask } = useMutation<
    TaskType,
    Error | AxiosError,
    string
  >({
    mutationKey: ["makeTaskFailed"],
    mutationFn: MakeTaskFailedFn,
    onSuccess: (data) => {
      updateExpiredTask(data);
    },
    onError: (error) => {
      const errorToShow = formatErrorMessage(error);

      if (errorToShow !== undefined && errorToShow) {
        toast.error(errorToShow);
      }
    },
  });

  return { failTask };
}

export default useMakeTaskFailed;
