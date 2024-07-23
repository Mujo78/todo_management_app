import { http, HttpResponse } from "msw";
import { LoginData } from "../app/authSlice";
import { LogindDataType } from "../features/auth/api";
import { AxiosError } from "axios";

type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
};

type LoginResponse = AxiosError | Error | LoginData | ErrorResponse;

export const handlers = [
  http.post<never, LogindDataType, LoginResponse>(
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
];
