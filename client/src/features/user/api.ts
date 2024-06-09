import { apiClient } from "../../helpers/ApiClient";

export interface UserAccountDataType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function UserSignupFn(signupData: UserAccountDataType) {
  const res = await apiClient.post("/users/registration", signupData);
  return res.data;
}
