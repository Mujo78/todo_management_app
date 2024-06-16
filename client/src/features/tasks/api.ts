import { apiClientAuth } from "../../helpers/ApiClient";

export async function GetMyTasksFn() {
  const res = await apiClientAuth.get("/v1/assignments/");
  return res.data;
}
