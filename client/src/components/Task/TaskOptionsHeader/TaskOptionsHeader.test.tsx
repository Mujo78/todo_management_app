import { describe, expect, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, mockTaskStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import useTaskStore from "../../../app/taskSlice";

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
});
