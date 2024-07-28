import { describe, it, beforeEach, afterEach, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import {
  profileDeleteUserNotFound,
  profileInfoUserNotFound,
} from "../../../msw/authHandlers";
import { fireEvent, screen, waitFor } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseModalFn = async () => {
  await waitFor(() => {
    const buttonDelete = screen.getByRole("button", {
      name: "Delete Account",
    });
    expect(buttonDelete).toBeInTheDocument();

    fireEvent.click(buttonDelete);
  });
};

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

  it("Should show delete profile modal and close it", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const numberOfTasks = await screen.findByText(
        "- your tasks will be deleted (2)"
      );
      expect(numberOfTasks).toBeInTheDocument();
    });
  });

  it("Should show delete profile modal and close it", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const numberOfTasks = await screen.findByText(
        "- your tasks will be deleted (2)"
      );
      expect(numberOfTasks).toBeInTheDocument();

      const buttonClose = await screen.findByRole("button", {
        name: "Close",
      });
      expect(buttonClose).toBeInTheDocument();
      fireEvent.click(buttonClose);

      expect(
        await screen.findByRole("button", {
          name: "Delete Account",
        })
      ).toBeVisible();
    });
  });

  it("Should show delete profile modal and try to delete, then return User not found", async () => {
    serviceWorker.use(profileDeleteUserNotFound);
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const buttonDelete = await screen.findByRole("button", {
        name: "Confirm",
      });
      expect(buttonDelete).toBeInTheDocument();
      fireEvent.click(buttonDelete);

      setTimeout(async () => {
        expect(await screen.findByText("User not found")).toBeInTheDocument();
      }, 2000);
    });
  });

  it("Should show delete profile modal and try to delete, with success", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const buttonDelete = await screen.findByRole("button", {
        name: "Confirm",
      });
      expect(buttonDelete).toBeInTheDocument();
      fireEvent.click(buttonDelete);

      setTimeout(async () => {
        expect(
          await screen.findByText("Profile succesfully deleted.")
        ).toBeInTheDocument();
      }, 2000);
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
