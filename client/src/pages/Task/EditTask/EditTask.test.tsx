import { describe, expect } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  baseChangeTaskFormFn,
  invalidTaskIdSentHandler,
  notAuthorizedTaskHandler,
  notFoundTaskHandler,
  taskNotFoundHandler,
} from "../../../msw/taskHandlers";
import { addDays } from "date-fns";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseCheckForGetMethodOnFormFields = async () => {
  renderWithRouter(["/edit-task/:taskId"]);

  await waitFor(() => {
    const pageTitle = screen.getByText("Edit task", { selector: "h5" });
    const titleEl = screen.getByLabelText("Title").querySelector("input")!;
    const descriptionEl = screen.getAllByLabelText("Description")![0];
    const priorityEl = screen
      .getByLabelText("Priority")
      .querySelector("input")!;
    const statusEl = screen.getByLabelText("Status").querySelector("input")!;

    const submitBtn = screen.getByRole("button", { name: "Save" });

    expect(submitBtn).toBeInTheDocument();
    expect(statusEl).toHaveValue("0");
    expect(priorityEl).toHaveValue("2");
    expect(descriptionEl).toHaveValue("Description");
    expect(pageTitle).toBeInTheDocument();
    expect(titleEl).toHaveValue("Test Assignment Four");
  });
};

describe("Edit Task component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should render and get data", async () => {
    await baseCheckForGetMethodOnFormFields();
  });

  it("Should display on english language", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const title = screen.getByText("Edit task", { selector: "h5" });
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });
  });

  it("Should display on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const title = screen.getByText("Uređivanje zadatka", { selector: "h5" });
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();
    });
  });

  it("Should display Assignment not found", async () => {
    serviceWorker.use(notFoundTaskHandler);
    renderWithRouter(["/edit-task/:taskId"]);

    setTimeout(async () => {
      expect(
        await screen.findByText("Assignment not found.")
      ).toBeInTheDocument();
    }, 2000);
  });

  it.each([
    [
      "Title must be at least 10 characters long.",
      {
        title: "Title",
        dueDate: new Date(),
        status: 2,
        priority: 1,
        description: "None",
      },
    ],
  ])("Should return message: `%s`", async (expectedMessage, value) => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(async () => {
      await baseChangeTaskFormFn(value, addDays(new Date(), 2));
    });
    await waitFor(async () => {
      const message = await screen.findByText(expectedMessage);
      expect(message).toBeInTheDocument();
    });
  });

  it.each([
    ["Invalid ID sent.", invalidTaskIdSentHandler],
    [
      "You are not authorize to access these resources.",
      notAuthorizedTaskHandler,
    ],
    ["Assignment not found.", taskNotFoundHandler],
  ])("Should return message: `%s`", async (message, handler) => {
    serviceWorker.use(handler);

    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(async () => {
      await baseChangeTaskFormFn(
        {
          title: "Title New Here Goes",
          dueDate: addDays(new Date(), 1),
          status: 0,
          priority: 2,
          description: "None",
        },
        addDays(new Date(), 2)
      );

      expect(await screen.findByText(message)).toBeInTheDocument();
    });
  });

  it("Should return assignment already exists error message", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(async () => {
      await baseChangeTaskFormFn(
        {
          title: "Already used title",
          dueDate: addDays(new Date(), 1),
          status: 0,
          priority: 2,
          description: "None",
        },
        addDays(new Date(), 2)
      );
    });

    await waitFor(async () => {
      expect(
        await screen.findByText(
          "Assignment with title: 'Already used title' already exists."
        )
      );
    });
  });

  it("Should be success", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(async () => {
      await baseChangeTaskFormFn(
        {
          title: "New title for this task",
          dueDate: addDays(new Date(), 1),
          status: 0,
          priority: 2,
          description: "None",
        },
        addDays(new Date(), 2)
      );
      expect(await screen.findByText("Task successfully updated."));
    });
  });

  it("Should display delete button", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const buttonDelete = screen.getByLabelText("DeleteTaskBtn");
      expect(buttonDelete).toBeInTheDocument();
    });
  });
});
