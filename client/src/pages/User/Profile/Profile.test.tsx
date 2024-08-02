import { describe, it, beforeEach, afterEach, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { profileInfoUserNotFound } from "../../../msw/authHandlers";
import { screen, waitFor } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Profile component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render and should be success", async () => {
    renderWithRouter(["/profile"]);
    await waitFor(() => {
      const userEmail = screen.getByText("correct@gmail.com");
      const buttonDelete = screen.getByRole("button", {
        name: "Delete Account",
      });

      expect(userEmail).toBeInTheDocument();
      expect(buttonDelete).toBeInTheDocument();
    });
  });

  it("Should return User not found.", async () => {
    serviceWorker.use(profileInfoUserNotFound);
    renderWithRouter(["/profile"]);

    setTimeout(async () => {
      expect(await screen.findByText("User not found")).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
