import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { GetMyTasksFn, ParamsType } from "./api";
import { AllTasksType } from "../../app/taskSlice";

function useGetTasks({ name, pageNum }: ParamsType) {
  const { isError, isPending, isSuccess, error, data } = useQuery<
    AllTasksType,
    Error | AxiosError<unknown, unknown>
  >({
    queryKey: ["tasks", name, pageNum],
    queryFn: () => GetMyTasksFn({ name, pageNum }),
  });

  return { data, error, isError, isPending, isSuccess };
}

export default useGetTasks;
