import { http, HttpResponse } from "msw";
import { LoginData } from "../app/authSlice";
import { LogindDataType } from "../features/auth/api";
import {
  ForgotPasswordType,
  ResetPasswordType,
  UserAccountDataType,
} from "../features/user/api";
import { ErrorResponse, Response } from "./Worker";

export const handlers = [
  http.post<never, LogindDataType, Response<LoginData>>(
    "https://localhost:7196/login",
    async ({ request }) => {
      const body = await request.json();

      const { email, password } = body;

      if (email !== "correct@gmail.com") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "NotFoundException",
            title: "Resource not found.",
            status: 404,
            detail: "Account doesn't exists.",
          },
          { status: 404 }
        );
      }

      if (password !== "correctPassword" || email !== "correct@gmail.com") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "BadRequestException",
            title: "Bad request.",
            status: 400,
            detail: "Incorrect email or password.",
          },
          { status: 400 }
        );
      }

      return HttpResponse.json<LoginData>(
        {
          accessToken: "accessTokenForTesting",
          user: {
            createdAt: new Date(),
            email: "correct@gmail.com",
            emailConfirmed: true,
            id: "asdasdasdasdas",
            name: "Test Correct One",
          },
        },
        { status: 200 }
      );
    }
  ),

  http.post<never, UserAccountDataType, Response<string>>(
    "https://localhost:7196/api/v1/users/registration",
    async ({ request }) => {
      const body = await request.json();
      const { email, confirmPassword, password } = body;

      if (password !== confirmPassword) {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "BadRequestException",
            title: "Bad request.",
            status: 400,
            detail: "Password and Confirm password must match.",
          },
          { status: 400 }
        );
      }

      if (email === "correctOne@gmail.com") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "ConflictException",
            title: "Conflict error.",
            status: 409,
            detail: "Email is already used!",
          },
          { status: 409 }
        );
      }

      return HttpResponse.json<string>(
        "Please check your inbox for verification email.",
        { status: 200 }
      );
    }
  ),

  http.post<never, ForgotPasswordType, Response<string>>(
    "https://localhost:7196/api/v1/users/forgot-password",
    async ({ request }) => {
      const body = await request.json();
      const { email } = body;

      if (email.startsWith("correctBut")) {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "ConflictException",
            title: "Conflict error.",
            status: 409,
            detail:
              "Reset password link already created. Please check your inbox.",
          },
          { status: 409 }
        );
      }

      if (email !== "correct@gmail.com") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "NotFoundException",
            title: "Resource not found.",
            status: 404,
            detail: "User not found.",
          },
          { status: 404 }
        );
      }

      return HttpResponse.json<string>(
        "Please check your inbox for reset password link.",
        { status: 200 }
      );
    }
  ),

  http.patch<never, ResetPasswordType, Response<string>>(
    "https://localhost:7196/api/v1/users/reset-password/:token",
    async ({ request }) => {
      const body = await request.json();

      const { confirmNewPassword, newPassword } = body;

      if (newPassword !== confirmNewPassword) {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "BadRequestException",
            title: "Bad request.",
            status: 400,
            detail: "Passwords must match",
          },
          { status: 400 }
        );
      }

      if (
        newPassword === "sameOldPassword&12345" &&
        newPassword === confirmNewPassword
      ) {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "BadRequestException",
            title: "Bad request.",
            status: 400,
            detail: "New password cannot be the same as the old password.",
          },
          { status: 400 }
        );
      }

      return HttpResponse.json<string>("Password successfully changed.", {
        status: 200,
      });
    }
  ),

  http.patch<{ token: string }, ResetPasswordType, Response<string>>(
    "https://localhost:7196/api/v1/users/verify/:token",
    async () => {
      return HttpResponse.json<string>("Successfully verified email address.", {
        status: 200,
      });
    }
  ),
];

export const resetPasswordHandler = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>(
  "https://localhost:7196/api/v1/users/reset-password/:invalidNotFoundedToken",
  async () => {
    return HttpResponse.json<ErrorResponse>(
      {
        type: "NotFoundException",
        title: "Resource not found.",
        status: 404,
        detail: "Invalid token provided. Token not found.",
      },
      { status: 404 }
    );
  }
);

export const resetPasswordNotValidToken = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>(
  "https://localhost:7196/api/v1/users/reset-password/:invalidToken",
  async () => {
    return HttpResponse.json<ErrorResponse>(
      {
        type: "BadRequestException",
        title: "Bad request.",
        status: 400,
        detail: "Invalid token provided.",
      },
      { status: 400 }
    );
  }
);

export const resetPasswordInvalidTokenNotFoundedUserHandler = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>(
  "https://localhost:7196/api/v1/users/reset-password/:invalidNotFoundedUserToken",
  async () => {
    return HttpResponse.json<ErrorResponse>(
      {
        type: "NotFoundException",
        title: "Resource not found.",
        status: 404,
        detail: "User not found.",
      },
      { status: 404 }
    );
  }
);

export const verifyEmailTokenNotFoundHandler = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>("https://localhost:7196/api/v1/users/verify/:tokenNotFound", async () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "NotFoundException",
      title: "Resource not found.",
      status: 404,
      detail: "Invalid token provided. Token not found.",
    },
    { status: 404 }
  );
});

export const verifyEmailInvalidTokenHandler = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>("https://localhost:7196/api/v1/users/verify/:invalidToken", async () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "BadRequestException",
      title: "Bad request.",
      status: 400,
      detail: "Invalid token provided.",
    },
    { status: 400 }
  );
});

export const verifyEmailTokenUserNotFoundHandler = http.patch<
  { token: string },
  ResetPasswordType,
  Response<string>
>(
  "https://localhost:7196/api/v1/users/verify/:invalidTokenUserNotFound",
  async () => {
    return HttpResponse.json<ErrorResponse>(
      {
        type: "NotFoundException",
        title: "Resource not found.",
        status: 404,
        detail: "User not found.",
      },
      { status: 404 }
    );
  }
);
