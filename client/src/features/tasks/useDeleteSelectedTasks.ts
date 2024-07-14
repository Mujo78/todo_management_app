import { useMutation } from "@tanstack/react-query";
import { DeleteSelectedTaskFn } from "./api";
import { AxiosError } from "axios";
import useTaskStore from "../../app/taskSlice";
import toast from "react-hot-toast";
import { formatErrorMessage } from "../../components/utils/user/userUtils";

function useDeleteSelectedTasks() {
  const { removeSelectedTasks } = useTaskStore();

  const { mutate: deleteSelectedTasks, isPending } = useMutation<
    unknown,
    Error | AxiosError,
    string[]
  >({
    mutationKey: ["deleteSelectedTasks"],
    mutationFn: DeleteSelectedTaskFn,
    onSuccess: () => {
      toast.success("Tasks successfully deleted.");
      removeSelectedTasks();
    },
    onError: (error) => {
      toast.error(formatErrorMessage(error));
    },
  });

  return { deleteSelectedTasks, isPending };
}

export default useDeleteSelectedTasks;
