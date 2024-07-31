import { http, HttpResponse } from "msw";
import { CreateUpdateTaskType, TaskType } from "../app/taskSlice";
import { ErrorResponse, Response } from "./Worker";
import { addDays } from "date-fns";

export const taskHandler = [
  http.post<never, CreateUpdateTaskType, Response<TaskType>>(
    "https://localhost:7196/api/v1/assignments",
    async ({ request }) => {
      const body = await request.json();
      const { title } = body;

      if (title === "Already used title") {
        return HttpResponse.json<ErrorResponse>(
          {
            type: "ConflictException",
            title: "Conflict error.",
            status: 409,
            detail:
              "Assignment with title: 'Already used title' already exists.",
          },
          {
            status: 409,
          }
        );
      }

      return HttpResponse.json<TaskType>(
        {
          id: "some-id",
          userId: "e569a650-3491-4833-a425-1d6412317b1e",
          title: "Already used again",
          description: "string",
          dueDate: addDays(new Date(), 2),
          priority: 1,
          status: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }
  ),

  http.get<never, undefined, Response<TaskType>>(
    "https://localhost:7196/api/v1/assignments/:taskId",
    () => {
      return HttpResponse.json<TaskType>(
        {
          id: "aecce5a1-c36d-4737-197e-08dcaa6f6588",
          userId: "e569a650-3491-4833-a425-1d6412317b1e",
          title: "Test Assignment Four",
          description: "Description",
          dueDate: addDays(new Date(), 2),
          priority: 2,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }
  ),
];

export const notFoundTaskHandler = http.get<
  never,
  undefined,
  Response<TaskType>
>("https://localhost:7196/api/v1/assignments/:invalidTaskId", () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "NotFoundException",
      title: "Resource not found.",
      status: 404,
      detail: "Assignment not found.",
    },
    {
      status: 404,
    }
  );
});
