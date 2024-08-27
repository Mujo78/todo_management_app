import { describe, it, beforeEach, afterEach, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { profileInfoUserNotFound } from "../../../msw/authHandlers";
import { screen, waitFor } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Profile component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should render and should be success", async () => {
    renderWithRouter(["/profile"]);
    await waitFor(() => {
      const userEmail = screen.getByText("correct@gmail.com");
      const buttonDelete = screen.getByLabelText("deleteModalProfileBtn");

      expect(userEmail).toBeInTheDocument();
      expect(buttonDelete).toBeInTheDocument();
    });
  });

  it("Should render and display on text english language", async () => {
    renderWithRouter(["/profile"]);

    await waitFor(() => {
      const userName = screen.getByText(/name\/username/i);
      expect(userName).toBeInTheDocument();
      expect(userName).toBeVisible();

      const joinedText = screen.getByText(/Joined/);
      expect(joinedText).toBeInTheDocument();
      expect(joinedText).toBeVisible();

      const deleteBtn = screen.getByText(/Delete Account/);
      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toBeVisible();

      const total = screen.getByText("Total", { selector: "tspan" });
      expect(total).toBeInTheDocument();
      expect(total).toBeVisible();

      const completed = screen.getByText("Completed", { selector: "tspan" });
      expect(completed).toBeInTheDocument();
      expect(completed).toBeVisible();

      const failed = screen.getByText("Failed", { selector: "tspan" });
      expect(failed).toBeInTheDocument();
      expect(failed).toBeVisible();

      const open = screen.getByText("Open", { selector: "tspan" });
      expect(open).toBeInTheDocument();
      expect(open).toBeVisible();

      const tasksText = screen.getByText("Tasks", { selector: "tspan" });
      expect(tasksText).toBeInTheDocument();
      expect(tasksText).toBeVisible();

      const averageText = screen.getByText("Average", { selector: "p" });
      expect(averageText).toBeInTheDocument();
      expect(averageText).toBeVisible();
    });
  });

  it("Should render and display on text bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile"]);

    await waitFor(() => {
      const userName = screen.getByText(/ime\/korisničko ime/i);
      expect(userName).toBeInTheDocument();
      expect(userName).toBeVisible();

      const joinedText = screen.getByText(/Pridružio se/);
      expect(joinedText).toBeInTheDocument();
      expect(joinedText).toBeVisible();

      const deleteBtn = screen.getByText(/Izbriši račun/);
      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toBeVisible();

      const total = screen.getByText("Ukupno", { selector: "tspan" });
      expect(total).toBeInTheDocument();
      expect(total).toBeVisible();

      const completed = screen.getByText("Dovršeno", { selector: "tspan" });
      expect(completed).toBeInTheDocument();
      expect(completed).toBeVisible();

      const failed = screen.getByText("Neuspješno", { selector: "tspan" });
      expect(failed).toBeInTheDocument();
      expect(failed).toBeVisible();

      const open = screen.getByText("Trenutni", { selector: "tspan" });
      expect(open).toBeInTheDocument();
      expect(open).toBeVisible();

      const tasksText = screen.getByText("Zadaci", { selector: "tspan" });
      expect(tasksText).toBeInTheDocument();
      expect(tasksText).toBeVisible();

      const averageText = screen.getByText("Prosjek", { selector: "p" });
      expect(averageText).toBeInTheDocument();
      expect(averageText).toBeVisible();
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
