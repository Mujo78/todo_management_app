import { AxiosError, isAxiosError } from "axios";

export function formatErrorFieldMessage(
  error: Error | AxiosError<unknown, unknown> | null,
  key: string
) {
  if (isAxiosError(error) && error.response?.data.errors) {
    return error.response?.data.errors[key][0];
  }
  return "";
}
export function formatErrorMessage(
  error: Error | AxiosError<unknown, unknown> | null
) {
  if (isAxiosError(error) && error.response) {
    return error.response?.data.detail;
  } else {
    error?.message ?? undefined;
  }
}
