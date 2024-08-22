import { useMutation } from "@tanstack/react-query";
import { DeleteAllTaskFn } from "./api";
import { AxiosError } from "axios";
import useTaskStore from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../utils/user/userUtils";

function useDeleteAllTasks() {
  const { initialize } = useTaskStore();

  const { mutate: deleteAllTasks, isPending } = useMutation<
    unknown,
    Error | AxiosError,
    undefined
  >({
    mutationKey: ["deleteAllTasks"],
    mutationFn: DeleteAllTaskFn,
    onSuccess: () => {
      toast.success("Tasks successfully deleted.");
      initialize();
    },
    onError: (error) => {
      toast.error(formatErrorMessage(error));
    },
  });

  return { deleteAllTasks, isPending };
}

export default useDeleteAllTasks;
