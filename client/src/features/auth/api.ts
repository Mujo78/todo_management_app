import { apiClientBase, apiClientAuth } from "../../helpers/ApiClient";

export interface LogindDataType {
  email: string;
  password: string;
}

export async function UserLoginFn(loginData: LogindDataType) {
  const res = await apiClientBase.post("/login", loginData, {
    withCredentials: true,
  });
  return res.data;
}

export async function RefreshSessionFn() {
  const res = await apiClientAuth.post(
    "/auth/refresh-token",
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function UserLogoutFn() {
  const res = await apiClientAuth.delete("/auth/logout", {
    withCredentials: true,
  });
  return res.data;
}
