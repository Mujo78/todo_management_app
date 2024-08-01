import { http, HttpResponse } from "msw";
import { CreateUpdateTaskType, TaskType } from "../app/taskSlice";
import { ErrorResponse, Response } from "./Worker";
import { addDays, format } from "date-fns";
import { act, fireEvent, screen } from "@testing-library/react";

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

  http.put<{ taskId: string }, TaskType, Response<TaskType>>(
    "https://localhost:7196/api/v1/assignments/:taskId",
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
          id: "aecce5a1-c36d-4737-197e-08dcaa6f6588",
          userId: "e569a650-3491-4833-a425-1d6412317b1e",
          title: "New title for this task",
          dueDate: addDays(new Date(), 1),
          status: 0,
          priority: 2,
          description: "None",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }
  ),

  http.delete<never, undefined, Response<string>>(
    "https://localhost:7196/api/v1/assignments/:taskId",
    () => {
      return HttpResponse.json<string>("aecce5a1-c36d-4737-197e-08dcaa6f6588", {
        status: 200,
      });
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

export const invalidTaskIdSentHandler = http.put<
  never,
  TaskType,
  Response<TaskType>
>("https://localhost:7196/api/v1/assignments/:taskId", () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "BadRequestException",
      title: "Bad request.",
      status: 400,
      detail: "Invalid ID sent.",
    },
    { status: 400 }
  );
});

export const notAuthorizedTaskHandler = http.put<
  never,
  TaskType,
  Response<TaskType>
>("https://localhost:7196/api/v1/assignments/:taskId", () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "ForbidException",
      title: "Forbidden",
      status: 403,
      detail: "You are not authorize to access these resources.",
    },
    { status: 403 }
  );
});

export const taskNotFoundHandler = http.put<
  never,
  TaskType,
  Response<TaskType>
>("https://localhost:7196/api/v1/assignments/:taskId", () => {
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

export const notFoundDeletingTaskHandler = http.delete<
  never,
  undefined,
  Response<string>
>("https://localhost:7196/api/v1/assignments/:taskId", () => {
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

export const notAuthorizedDeletingTaskHandler = http.delete<
  never,
  undefined,
  Response<string>
>("https://localhost:7196/api/v1/assignments/:taskId", () => {
  return HttpResponse.json<ErrorResponse>(
    {
      type: "ForbidException",
      title: "Forbidden",
      status: 403,
      detail: "You are not authorize to access these resources.",
    },
    { status: 403 }
  );
});

export const baseChangeTaskFormFn = async (
  { title, dueDate, priority, status, description }: CreateUpdateTaskType,
  dueDateLabel?: Date
) => {
  const formattedDate = format(dueDateLabel ?? new Date(), "MMM d, yyyy");

  const titleEl = screen.getByLabelText("Title").querySelector("input")!;
  const dueDateElInput = screen.getByLabelText(
    `Choose date, selected date is ${formattedDate}`
  )!;
  const descriptionEl = screen.getAllByLabelText("Description")![0];

  const priorityEl = screen.getByLabelText("Priority").querySelector("input")!;
  const statusEl = screen
    .getAllByLabelText("Status")[1]
    .querySelector("input")!;
  const submitBtn = screen.getByRole("button", { name: "Save" });

  expect(titleEl).toBeInTheDocument();
  expect(dueDateElInput).toBeInTheDocument();
  expect(descriptionEl).toBeInTheDocument();
  expect(priorityEl).toBeInTheDocument();
  expect(statusEl).toBeInTheDocument();
  expect(submitBtn).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(titleEl, { target: { value: title } });
    fireEvent.change(dueDateElInput, { target: { value: dueDate } });
    fireEvent.change(descriptionEl, { target: { value: description } });
    fireEvent.change(priorityEl, { target: { value: priority } });
    fireEvent.change(statusEl, { target: { value: status } });

    fireEvent.click(submitBtn);
  });
};
