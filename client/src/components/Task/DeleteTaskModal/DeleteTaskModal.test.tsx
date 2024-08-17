import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
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
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
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
