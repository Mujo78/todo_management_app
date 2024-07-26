import { http, HttpResponse } from "msw";
import { ErrorResponse, Response } from "./Worker";
import { UserType } from "../app/authSlice";

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
