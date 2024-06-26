import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GetTasksByIdFn } from "./api";
import { TaskType } from "../../app/taskSlice";

function useGetTask(taskId?: string) {
  const { isError, isPending, isSuccess, error, data } = useQuery<
    TaskType,
    Error | AxiosError<unknown, unknown>
  >({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (taskId) {
        return await GetTasksByIdFn(taskId);
      }
    },
    placeholderData: keepPreviousData,
    retry: 1,
  });

  return { data, error, isError, isPending, isSuccess };
}

export default useGetTask;
