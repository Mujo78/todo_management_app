import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import useAuthStore from "../../app/authSlice";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { mockStore, serviceWorker } from "../../msw/Worker";
import { shouldReturnEmptyArrayForTasksData } from "../../msw/taskHandlers";

vi.mock("../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const searchFor = (name: string) => {
  const searchInput = screen
    .getAllByLabelText("Search")[1]
    .querySelector("input")!;
  expect(searchInput).toBeInTheDocument();

  fireEvent.change(searchInput, {
    target: { value: name },
  });
  fireEvent.keyPress(searchInput, {
    key: "Enter",
    code: "Enter",
    charCode: 13,
  });
};

describe("Home Page component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const userName = screen.getByText("User Test One");
      expect(userName).toBeInTheDocument();
    });
  });

  it("Should successfully make GET request and show Task Cards", async () => {
    renderWithRouter(["/home"]);

    await waitFor(async () => {
      const openTask = screen.getByText("Open Task Here...");
      const failedTask = screen.getByText("Failed Task Here...");
      const completedTask = screen.getByText("Completed Task Here...");

      expect(openTask).toBeInTheDocument();
      expect(failedTask).toBeInTheDocument();
      expect(completedTask).toBeInTheDocument();
    });
  });

  it("Should show pagination, search header and button options", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const pagination = screen.getByLabelText("pagination navigation");
      const searchInput = screen
        .getAllByLabelText("Search")[1]
        .querySelector("input");
      const btnRemoveAllTasks = screen.getByLabelText("RemoveAllTasks");

      expect(pagination).toBeInTheDocument();
      expect(searchInput).toBeInTheDocument();
      expect(btnRemoveAllTasks).toBeInTheDocument();
    });
  });

  it("Should navigate to add task page with + btn in search header", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const addTaskBtn = screen.getByLabelText("AddNewTask");
      expect(addTaskBtn).toBeInTheDocument();

      fireEvent.click(addTaskBtn);

      expect(window.location.pathname === "/add-task");
    });
  });

  it("Should display no data available when there are no tasks available", async () => {
    serviceWorker.use(shouldReturnEmptyArrayForTasksData);

    renderWithRouter(["/home"]);

    await waitFor(() => {
      const alertInfo = screen.getByText("No data available.");
      expect(alertInfo).toBeInTheDocument();
    });
  });

  it("Should search for task and return no data available", async () => {
    renderWithRouter(["/home"]);

    await waitFor(async () => {
      searchFor("Not founded task here");

      expect(
        window.location.pathname ===
          "/home?pageNum=1&name=Not+founded+task+here"
      );

      expect(await screen.findByText("No data available.")).toBeInTheDocument();
    });
  });

  it("Should successfully search and find task", async () => {
    renderWithRouter(["/home"]);

    await waitFor(async () => {
      searchFor("Open Task Here");

      expect(
        window.location.pathname === "/home?pageNum=1&name=Open+Task+Here"
      );

      expect(await screen.findByText("Open Task Here...")).toBeInTheDocument();
    });
  });

  it("Should search and clear search input", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      searchFor("Founded Task Here");

      expect(
        window.location.pathname === "/home?pageNum=1&name=Founded+Task+Here"
      );

      setTimeout(async () => {
        const clearBtn = await screen.findByRole("button", { name: "Clear" });
        expect(clearBtn).toBeInTheDocument();

        fireEvent.click(clearBtn);

        expect(window.location.pathname === "/home?pageNum=1");
      }, 2000);
    });
  });

  it("Should display no data available, when user navigate to page 3 out of 2 pages", async () => {
    renderWithRouter(["/home?pageNum=3"]);

    await waitFor(async () => {
      setTimeout(async () => {
        expect(
          await screen.findByText("No data available.")
        ).toBeInTheDocument();
      }, 2000);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
