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
