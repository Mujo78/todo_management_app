import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import useAuthStore from "../../app/authSlice";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import { mockStore } from "../../msw/Worker";

vi.mock("../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

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

  afterEach(() => {
    vi.clearAllMocks();
  });
});
