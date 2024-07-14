import { useMutation } from "@tanstack/react-query";
import { DeleteTaskFn } from "./api";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../components/utils/user/userUtils";

function useDeleteTask() {
  const { mutate: deleteTask, isPending } = useMutation<
    string,
    Error | AxiosError,
    string
  >({
    mutationKey: ["deleteTask"],
    mutationFn: DeleteTaskFn,
    onSuccess: () => {
      toast.success("Tasks successfully deleted.");
    },
    onError: (error) => {
      toast.error(formatErrorMessage(error));
    },
  });

  return { deleteTask, isPending };
}

export default useDeleteTask;
