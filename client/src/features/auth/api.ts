import { apiClientBase } from "../../helpers/ApiClient";

export interface LogindDataType {
  email: string;
  password: string;
}

export async function UserLoginFn(loginData: LogindDataType) {
  const res = await apiClientBase.post("/login", loginData);
  return res.data;
}
