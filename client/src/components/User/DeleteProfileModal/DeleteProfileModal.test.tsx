import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { profileDeleteUserNotFound } from "../../../msw/authHandlers";

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

describe("Delete profile modal component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should show delete profile modal", async () => {
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

  afterEach(() => {
    vi.clearAllMocks();
  });
});
