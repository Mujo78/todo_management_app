import { afterEach, beforeEach, describe, vi } from "vitest";
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

  afterEach(() => {
    vi.clearAllMocks();
  });
});
