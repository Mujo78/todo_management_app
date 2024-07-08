import { CreateUpdateTaskType, TaskType } from "../../app/taskSlice";
import { apiClientAuth } from "../../helpers/ApiClient";

export interface ParamsType {
  name?: string | null;
  pageNum?: string | number;
}

export async function GetMyTasksFn({ name, pageNum }: ParamsType) {
  const res = await apiClientAuth.get("/v1/assignments/", {
    params: {
      name,
      pageNum,
    },
  });
  return res.data;
}

export async function GetTasksByIdFn(taskId: string) {
  const res = await apiClientAuth.get(`/v1/assignments/${taskId}`);
  return res.data;
}

export async function CreateTaskFn(values: CreateUpdateTaskType) {
  const res = await apiClientAuth.post("/v1/assignments/", values);
  return res.data;
}

export interface UpdateTaskArgs {
  taskId: string;
  values: TaskType;
}

export async function UpdateTaskFn({ taskId, values }: UpdateTaskArgs) {
  const res = await apiClientAuth.put(`/v1/assignments/${taskId}`, values);
  return res.data;
}

export async function DeleteAllTaskFn() {
  const res = await apiClientAuth.delete("/v1/assignments/");
  return res.data;
}

export async function DeleteSelectedTaskFn(values: string[]) {
  const res = await apiClientAuth.delete("/v1/assignments/selected", {
    data: values,
  });
  return res.data;
}

export async function DeleteTaskFn(taskId: string) {
  const res = await apiClientAuth.delete(`/v1/assignments/${taskId}`);
  return res.data;
}

export async function MakeTaskFinishedFn(values: string[]) {
  const res = await apiClientAuth.patch("/v1/assignments/", values);
  return res.data;
}

export async function MakeTaskFailedFn(taskId: string) {
  const res = await apiClientAuth.patch(`/v1/assignments/${taskId}`);
  return res.data;
}
