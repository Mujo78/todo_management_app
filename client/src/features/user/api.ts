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

export async function VerifyEmailFn(token: string) {
  const res = await apiClient.patch(`/users/verify/${token}`);
  return res.data;
}

export interface ForgotPasswordType {
  email: string;
}

export async function ForgotPasswordFn(data: ForgotPasswordType) {
  const res = await apiClient.post(`/users/forgot-password/`, data);
  return res.data;
}

export interface ResetPasswordType {
  newPassword: string;
  confirmNewPassword: string;
}

export async function ResetPasswordFn([token, data]: [
  string,
  ResetPasswordType
]) {
  const res = await apiClient.patch(`/users/reset-password/${token}`, data);
  return res.data;
}
