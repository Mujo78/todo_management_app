import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { profileDeleteUserNotFound } from "../../../msw/authHandlers";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseModalFn = async () => {
  await waitFor(() => {
    const buttonDelete = screen.getByLabelText("deleteModalProfileBtn");
    expect(buttonDelete).toBeInTheDocument();

    fireEvent.click(buttonDelete);
  });
};

describe("Delete profile modal component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should display delete profile modal on english language", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();

    await waitFor(async () => {
      const title = await screen.findByText(
        "Are you sure you want to delete your profile?"
      );
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();

      const textList = await screen.findByText(
        "By deleting your profile, you will:"
      );
      expect(textList).toBeInTheDocument();
      expect(textList).toBeVisible();

      const loseProfileForeverText = await screen.findByText(
        "- lose your profile forever,"
      );
      expect(loseProfileForeverText).toBeInTheDocument();
      expect(loseProfileForeverText).toBeVisible();

      const numberOfTasks = await screen.findByText(
        "- your tasks will be deleted (2)"
      );
      expect(numberOfTasks).toBeInTheDocument();
      expect(numberOfTasks).toBeVisible();

      const closeBtn = await screen.findByLabelText(
        "closeDeleteProfileModalbtn"
      );
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toBeVisible();
      expect(closeBtn).toHaveTextContent("Close");

      const confirmBtn = await screen.findByLabelText(
        "confirmDeleteProfilebtn"
      );
      expect(confirmBtn).toBeInTheDocument();
      expect(confirmBtn).toBeVisible();
      expect(confirmBtn).toHaveTextContent("Confirm");
    });
  });

  it("Should display delete profile modal on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile"]);
    await baseModalFn();

    await waitFor(async () => {
      const title = await screen.findByText(
        "Jeste li sigurni da želite izbrisati svoj račun?"
      );
      expect(title).toBeInTheDocument();
      expect(title).toBeVisible();

      const textList = await screen.findByText("Brisanjem profila, vi ćete:");
      expect(textList).toBeInTheDocument();
      expect(textList).toBeVisible();

      const loseProfileForeverText = await screen.findByText(
        "- izgubiti račun zauvijek,"
      );
      expect(loseProfileForeverText).toBeInTheDocument();
      expect(loseProfileForeverText).toBeVisible();

      const numberOfTasks = await screen.findByText(
        "- obrisati sve zadatke (2)"
      );
      expect(numberOfTasks).toBeInTheDocument();
      expect(numberOfTasks).toBeVisible();

      const closeBtn = await screen.findByLabelText(
        "closeDeleteProfileModalbtn"
      );
      expect(closeBtn).toBeInTheDocument();
      expect(closeBtn).toBeVisible();
      expect(closeBtn).toHaveTextContent("Zatvori");

      const confirmBtn = await screen.findByLabelText(
        "confirmDeleteProfilebtn"
      );
      expect(confirmBtn).toBeInTheDocument();
      expect(confirmBtn).toBeVisible();
      expect(confirmBtn).toHaveTextContent("Potvrdi");
    });
  });

  it("Should display delete profile modal and close it", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const numberOfTasks = await screen.findByText(
        "- your tasks will be deleted (2)"
      );
      expect(numberOfTasks).toBeInTheDocument();

      const buttonClose = await screen.findByLabelText(
        "closeDeleteProfileModalbtn"
      );
      expect(buttonClose).toBeInTheDocument();
      fireEvent.click(buttonClose);

      expect(
        await screen.findByLabelText("deleteModalProfileBtn")
      ).toBeVisible();
    });
  });

  it("Should display delete profile modal and try to delete, then return User not found", async () => {
    serviceWorker.use(profileDeleteUserNotFound);
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const buttonDelete = await screen.findByLabelText(
        "confirmDeleteProfilebtn"
      );
      expect(buttonDelete).toBeInTheDocument();
      fireEvent.click(buttonDelete);

      setTimeout(async () => {
        expect(await screen.findByText("User not found")).toBeInTheDocument();
      }, 2000);
    });
  });

  it("Should display delete profile modal and try to delete, with success", async () => {
    renderWithRouter(["/profile"]);
    await baseModalFn();
    await waitFor(async () => {
      const buttonDelete = await screen.findByLabelText(
        "confirmDeleteProfilebtn"
      );
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
