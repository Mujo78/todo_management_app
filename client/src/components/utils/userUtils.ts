import { AxiosError, isAxiosError } from "axios";

export function formatErrorFieldMessage(
  error: Error | AxiosError<unknown, unknown> | null,
  key: string
) {
  if (isAxiosError(error)) {
    if (error.response?.data.errors) {
      return error.response?.data.errors[key][0];
    } else if (error?.response?.data.detail.toLowerCase().includes(key)) {
      return error?.response?.data.detail;
    }
    return "";
  }
}
export function formatErrorMessage(
  error: Error | AxiosError<unknown, unknown> | null
) {
  if (
    isAxiosError(error) &&
    error?.response &&
    error?.response?.status !== 409
  ) {
    return error.response?.data.detail;
  } else if (isAxiosError(error) && error.response?.status === 409) {
    return undefined;
  } else {
    return error?.message ?? undefined;
  }
}
