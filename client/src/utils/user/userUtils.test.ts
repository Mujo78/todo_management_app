import { AxiosError, isAxiosError } from "axios";
import { describe, it, expect, vi } from "vitest";
import {
  formatErrorFieldMessage,
  formatErrorMessage,
  isErrorForKey,
} from "./userUtils";
import "../../i18n";

vi.mock("axios", () => ({
  isAxiosError: vi.fn(),
}));

const returnErrorObj = (value: string) => {
  const error = {
    response: {
      data: {
        detail: `${value} is already used.`,
      },
      status: 409,
    },
  };

  return error;
};

const returnFieldErrorObj = (value: string) => {
  const error = {
    response: {
      data: {
        errors: {
          Email: [value],
        },
      },
    },
  };

  return error;
};

const returnErrorMessageObj = (value: string) => {
  const error: {
    message?: string;
    name: string;
    stack: string;
  } = {
    message: `${value} not found.`,
    name: "Error",
    stack: "...",
  };

  return error;
};

describe("Testing formatErrorFieldMessage Fn", () => {
  it("Should return error for an email field", () => {
    const errorToUse = returnFieldErrorObj("Email is required.");

    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorFieldMessage(
      errorToUse as AxiosError,
      "Email"
    );

    expect(errorMessage).toBe("Email is required.");
  });

  it.each([
    [
      "error for already used email address",
      returnErrorObj("Email"),
      "Email",
      "Email is already used.",
    ],
    ["empty", returnErrorObj("Name"), "Email", ""],
  ])("Should return %s", (_, input, key, expected) => {
    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorFieldMessage(input as AxiosError, key);
    expect(errorMessage).toBe(expected);
  });
});

describe("Testing isErrorForKey Fn", () => {
  it.each([
    ["true", returnFieldErrorObj("Email"), "Email", true],
    ["true", returnErrorObj("Email"), "Email", true],
    ["false", returnErrorObj("Email"), "Name", false],
  ])("Should return %s", (_, input, key, expected) => {
    vi.mocked(isAxiosError).mockReturnValue(true);

    const isError = isErrorForKey(input as AxiosError, key);
    expect(isError).toBe(expected);
  });
});

describe("Testing formatErroMessage Fn", () => {
  it("Should return error already used message", () => {
    const errorToUse = returnErrorObj("Email");
    errorToUse.response.status = 400;

    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorMessage(errorToUse as AxiosError);
    expect(errorMessage).toBe("Email is already used.");
  });

  it("Should return undefined", () => {
    const errorToUse = returnErrorObj("Email");

    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorMessage(errorToUse as AxiosError);
    expect(errorMessage).toBe(undefined);
  });

  it("Should return email not found", () => {
    const errorToUse = returnErrorMessageObj("Email");

    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorMessage(errorToUse as AxiosError);
    expect(errorMessage).toBe("Email not found.");
  });

  it("Should return undefined from error obj", () => {
    const errorToUse = returnErrorMessageObj("Email");
    errorToUse.message = undefined;

    vi.mocked(isAxiosError).mockReturnValue(true);

    const errorMessage = formatErrorMessage(errorToUse as AxiosError);
    expect(errorMessage).toBe(undefined);
  });
});
