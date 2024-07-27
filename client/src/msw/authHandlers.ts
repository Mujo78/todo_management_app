import { http, HttpResponse } from "msw";
import { ErrorResponse, Response } from "./Worker";
import { UserType } from "../app/authSlice";
import { ChangePasswordType } from "../features/user/api";

export const authHandler = [
  http.put<never, UserType, Response<UserType>>(
    "https://localhost:7196/api/v1/users",
    async ({ request }) => {
      const body = await request.json();

      const { email } = body;

      if (email === "userInvalid@gmail.com") {
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

      return HttpResponse.json<UserType>(
        {
          name: "User Test One",
          createdAt: new Date(),
          email: "user1234@gmail.com",
          emailConfirmed: true,
          id: "correctId",
        },
        { status: 200 }
      );
    }
  ),

  http.post<never, ChangePasswordType, Response<string>>(
    "https://localhost:7196/api/v1/users/change-password",
    async ({ request }) => {
      const body = await request.json();
      const { oldPassword, newPassword } = body;

      if (oldPassword !== "Password&12345") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "BadRequestException",
            title: "Bad request.",
            status: 400,
            detail: "Wrong old password.",
          },
          { status: 400 }
        );
      }

      if (oldPassword === newPassword) {
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
];

export const updateProfileForbiddenRequest = http.put<
  never,
  UserType,
  Response<string>
>("https://localhost:7196/api/v1/users", async ({ request }) => {
  const body = await request.json();

  const { id } = body;

  if (id !== "correctIdOfTheUser") {
    return HttpResponse.json<ErrorResponse>(
      {
        type: "ForbidException",
        title: "Forbidden",
        status: 403,
        detail: "You are not authorize to access these resources.",
      },
      { status: 403 }
    );
  }
});

export const changePasswordUserNotFoundRequest = http.post<
  never,
  ChangePasswordType,
  Response<string>
>("https://localhost:7196/api/v1/users/change-password", () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "NotFoundException",
      title: "Resource not found.",
      status: 404,
      detail: "User not found.",
    },
    { status: 404 }
  );
});
