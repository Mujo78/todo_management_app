import { http, HttpResponse } from "msw";
import { CreateUpdateTaskType, TaskType } from "../app/taskSlice";
import { Response } from "./Worker";
import { addDays } from "date-fns";

export const taskHandler = [
  http.post<never, CreateUpdateTaskType, Response<TaskType>>(
    "https://localhost:7196/api/v1/assignments",
    async ({ request }) => {
      const body = await request.json();
      const { title } = body;

      if (title === "Already used") {
        return HttpResponse.json(
          {
            type: "ConflictException",
            title: "Conflict error.",
            status: 409,
            detail: "Assignment with title: 'Already used' already exists.",
          },
          {
            status: 409,
          }
        );
      }

      return HttpResponse.json(
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
];
