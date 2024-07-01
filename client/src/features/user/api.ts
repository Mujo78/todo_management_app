import { UserType } from "../../app/authSlice";
import { apiClient, apiClientAuth } from "../../helpers/ApiClient";

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
  string | undefined,
  ResetPasswordType
]) {
  const res = await apiClient.patch(`/users/reset-password/${token}`, data);
  return res.data;
}

export interface MyInfoType {
  user: UserType;
  assignmentCount: {
    total: number;
    completed: number;
    failed: number;
    open: number;
  };
  average: number;
}

export async function GetMyInfoFn() {
  const res = await apiClientAuth.get("/v1/users/my-info");
  return res.data;
}

export interface UserProfileUpdateType {
  name: string;
  email: string;
}

export async function UpdateProfileFn(data: UserType) {
  const res = await apiClientAuth.put("/v1/users/", data);
  return res.data;
}

export interface ChangePasswordType {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export async function ChangePasswordFn(data: ChangePasswordType) {
  const res = await apiClientAuth.post("/v1/users/change-password", data);
  return res.data;
}

export async function DeleteMyProfileFn() {
  const res = await apiClientAuth.delete("/v1/users/");
  return res.data;
}
