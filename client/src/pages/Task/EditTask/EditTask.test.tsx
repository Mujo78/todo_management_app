import { describe, expect } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  baseChangeTaskFormFn,
  invalidTaskIdSentHandler,
  notAuthorizedDeletingTaskHandler,
  notAuthorizedTaskHandler,
  notFoundDeletingTaskHandler,
  notFoundTaskHandler,
  taskNotFoundHandler,
} from "../../../msw/taskHandlers";
import { addDays } from "date-fns";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseModalFn = async () => {
  await waitFor(() => {
    const buttonDelete = screen.getByRole("button", {
      name: "Delete Task",
    });

    expect(buttonDelete).toBeInTheDocument();

    fireEvent.click(buttonDelete);
  });
};

const baseCheckForGetMethodOnFormFields = async () => {
  renderWithRouter(["/edit-task/:taskId"]);

  await waitFor(() => {
    const pageTitle = screen.getByText("Edit task", { selector: "h5" });
    const titleEl = screen.getByLabelText("Title").querySelector("input")!;
    const descriptionEl = screen.getAllByLabelText("Description")![0];

    const priorityEl = screen
      .getByLabelText("Priority")
      .querySelector("input")!;
    const statusEl = screen
      .getAllByLabelText("Status")[1]
      .querySelector("input")!;
    const submitBtn = screen.getByRole("button", { name: "Save" });

    expect(titleEl).toHaveValue("Test Assignment Four");
    expect(descriptionEl).toHaveValue("Description");
    expect(priorityEl).toHaveValue("2");
    expect(statusEl).toHaveValue("0");
    expect(pageTitle).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });
};

describe("Edit Task component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render and get data", async () => {
    await baseCheckForGetMethodOnFormFields();
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

      setTimeout(async () => {
        expect(await screen.findByText(message)).toBeInTheDocument();
      }, 2000);
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
    });

    await waitFor(async () => {
      expect(await screen.findByText("Task successfully updated."));
    });
  });

  it("Should display delete button", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const buttonDelete = screen.getByRole("button", { name: "Delete Task" });
      expect(buttonDelete).toBeInTheDocument();
    });
  });

  it("Should open, show and close modal", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await baseModalFn();

    await waitFor(async () => {
      const taskTitle = screen.getByText(
        "Are you sure you want to delete your task: Test Assignment Four?",
        { selector: "h2" }
      );
      const closeButton = screen.getByRole("button", { name: "Close" });

      expect(taskTitle).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(
        await screen.findByRole("button", {
          name: "Delete Task",
        })
      ).toBeVisible();
    });
  });

  it.each([
    ["Assignment not found.", notFoundDeletingTaskHandler],
    [
      "You are not authorize to access these resources.",
      notAuthorizedDeletingTaskHandler,
    ],
  ])("Should return message: `%s`", async (message, handler) => {
    serviceWorker.use(handler);

    renderWithRouter(["/edit-task/:taskId"]);

    await baseModalFn();

    await waitFor(() => {
      const btnDelete = screen.getByRole("button", { name: "Confirm" });
      expect(btnDelete).toBeInTheDocument();

      fireEvent.click(btnDelete);

      setTimeout(async () => {
        expect(await screen.findByText(message)).toBeInTheDocument();
      }, 2000);
    });
  });

  it("Should be success deleting", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await baseModalFn();

    await waitFor(async () => {
      const btnDelete = screen.getByRole("button", { name: "Confirm" });
      expect(btnDelete).toBeInTheDocument();

      fireEvent.click(btnDelete);

      setTimeout(async () => {
        expect(
          await screen.findByText("Task successfully deleted.")
        ).toBeInTheDocument();
      }, 2000);

      expect(window.location.pathname === "/home");
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
