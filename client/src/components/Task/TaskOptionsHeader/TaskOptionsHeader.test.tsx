import { describe, expect, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, mockTaskStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import useTaskStore from "../../../app/taskSlice";
import {
  shouldReturnNoProvidedTasksWhenMakingFinishedTasks,
  shouldReturnOneTaskOrMoreNotFoundWhenMakingFinishedTasks,
  shouldReturnUnauthorizedWhenMakingFinishedTasks,
} from "../../../msw/taskHandlers";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

vi.mock("../../../app//taskSlice.ts", () => ({
  default: vi.fn(),
}));

describe("TaskOptionsHeader component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (useTaskStore as unknown as jest.Mock).mockReturnValue(mockTaskStore);
  });

  it("Should render", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToRemoveAll = screen.getByLabelText("RemoveAllTasks");
      expect(btnToRemoveAll).toBeInTheDocument();
    });
  });

  it("Should show all options for actions", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToRemoveAll = screen.getByLabelText("RemoveAllTasks");
      expect(btnToRemoveAll).toBeInTheDocument();

      const btnToMakeTasksFinished = screen.getByLabelText("MakeTasksFinished");
      expect(btnToMakeTasksFinished).toBeInTheDocument();

      const btnToRemoveSelectedTasks = screen.getByLabelText(
        "RemoveSelectedTasks"
      );
      expect(btnToRemoveSelectedTasks).toBeInTheDocument();
    });
  });

  it("Should successfully delete all tasks", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToRemoveAll = screen.getByLabelText("RemoveAllTasks");
      expect(btnToRemoveAll).toBeInTheDocument();

      setTimeout(async () => {
        expect(
          await screen.findByText("Tasks successfully deleted.")
        ).toBeInTheDocument();
      });
    });
  });

  it.each([
    [
      "You are not authorize to access these resources.",
      shouldReturnUnauthorizedWhenMakingFinishedTasks,
    ],
    [
      "No assignments provided.",
      shouldReturnNoProvidedTasksWhenMakingFinishedTasks,
    ],
    [
      "One or more assignments not found with the provided data.",
      shouldReturnOneTaskOrMoreNotFoundWhenMakingFinishedTasks,
    ],
  ])("Should return message: `%s`", async (expected, handler) => {
    serviceWorker.use(handler);
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToMakeTasksFinished = screen.getByLabelText("MakeTasksFinished");
      expect(btnToMakeTasksFinished).toBeInTheDocument();

      setTimeout(async () => {
        expect(await screen.findByText(expected)).toBeInTheDocument();
      }, 2000);
    });
  });

  it("Should successfully complete tasks", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToMakeTasksFinished = screen.getByLabelText("MakeTasksFinished");
      expect(btnToMakeTasksFinished).toBeInTheDocument();

      setTimeout(async () => {
        expect(
          await screen.findByText("Tasks successfully completed.")
        ).toBeInTheDocument();
      }, 2000);
    });
  });

  it("Should successfully delete selected tasks", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const btnToRemoveSelectedTasks = screen.getByLabelText(
        "RemoveSelectedTasks"
      );
      expect(btnToRemoveSelectedTasks).toBeInTheDocument();

      setTimeout(async () => {
        expect(
          await screen.findByText("Tasks successfully deleted.")
        ).toBeInTheDocument();
      }, 2000);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
