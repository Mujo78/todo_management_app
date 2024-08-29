import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import {
  notAuthorizedDeletingTaskHandler,
  notFoundDeletingTaskHandler,
} from "../../../msw/taskHandlers";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseModalFn = async () => {
  await waitFor(() => {
    const buttonDelete = screen.getByLabelText("DeleteTaskBtn");
    expect(buttonDelete).toBeInTheDocument();

    fireEvent.click(buttonDelete);
  });
};

describe("Delete task modal component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should open and display text on english language", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await baseModalFn();

    await waitFor(async () => {
      const taskTitle = screen.getByText(
        "Are you sure you want to delete your task: Test Assignment Four?",
        { selector: "h2" }
      );
      expect(taskTitle).toBeInTheDocument();
      expect(taskTitle).toBeVisible();

      const closeButton = screen.getByLabelText("CloseDeleteTaskModalBtn");

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeVisible();
      expect(closeButton).toHaveTextContent("Close");

      const confirmButton = screen.getByLabelText("ConfirmDeleteTaskModalBtn");

      expect(confirmButton).toBeInTheDocument();
      expect(confirmButton).toBeVisible();
      expect(confirmButton).toHaveTextContent("Confirm");
    });
  });

  it("Should open and display text on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/edit-task/:taskId"]);

    await baseModalFn();

    await waitFor(async () => {
      const taskTitle = screen.getByText(
        "Jeste li sigurni da želite izbrisati zadatak: Test Assignment Four?",
        { selector: "h2" }
      );
      expect(taskTitle).toBeInTheDocument();
      expect(taskTitle).toBeVisible();

      const closeButton = screen.getByLabelText("CloseDeleteTaskModalBtn");

      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toBeVisible();
      expect(closeButton).toHaveTextContent("Zatvori");

      const confirmButton = screen.getByLabelText("ConfirmDeleteTaskModalBtn");

      expect(confirmButton).toBeInTheDocument();
      expect(confirmButton).toBeVisible();
      expect(confirmButton).toHaveTextContent("Potvrdi");
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
      const closeButton = screen.getByLabelText("CloseDeleteTaskModalBtn");

      expect(taskTitle).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(await screen.findByLabelText("DeleteTaskBtn")).toBeVisible();
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
      const btnDelete = screen.getByLabelText("ConfirmDeleteTaskModalBtn");
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
      const btnDelete = screen.getByLabelText("ConfirmDeleteTaskModalBtn");
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
