import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GetMyTasksFn } from "./api";
import { TaskType } from "../../app/taskSlice";

function useGetTasks() {
  const { isError, isPending, isSuccess, error, data } = useQuery<
    TaskType[],
    Error | AxiosError<unknown, unknown>
  >({
    queryKey: ["tasks"],
    queryFn: GetMyTasksFn,
  });

  return { data, error, isError, isPending, isSuccess };
}

export default useGetTasks;
