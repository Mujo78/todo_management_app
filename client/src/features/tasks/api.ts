import { CreateTaskType } from "../../app/taskSlice";
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

export async function CreateTaskFn(values: CreateTaskType) {
  const res = await apiClientAuth.post("/v1/assignments/", values);
  return res.data;
}

export async function DeleteAllTaskFn() {
  const res = await apiClientAuth.delete("/v1/assignments/");
  return res.data;
}

export async function MakeTaskFinishedFn(values: string[]) {
  const res = await apiClientAuth.patch("/v1/assignments/", values);
  return res.data;
}
