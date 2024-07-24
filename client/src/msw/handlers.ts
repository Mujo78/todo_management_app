import { http, HttpResponse } from "msw";
import { LoginData } from "../app/authSlice";
import { LogindDataType } from "../features/auth/api";
import { AxiosError } from "axios";
import { ForgotPasswordType, UserAccountDataType } from "../features/user/api";

type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
};

type Response<T> = AxiosError | Error | T | ErrorResponse;

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
];
