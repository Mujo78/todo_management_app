import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { updateProfileForbiddenRequest } from "../../../msw/authHandlers";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Edit Profile component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
    renderWithRouter(["/profile/edit"]);
  });

  it("Should render and display text on english language", () => {
    const userEmailInput = screen.getByLabelText("Email");

    expect(userEmailInput).toBeInTheDocument();
    expect(userEmailInput).toBeVisible();

    const userNameInput = screen.getByLabelText(/name\/username/i);

    expect(userNameInput).toBeInTheDocument();
    expect(userNameInput).toBeVisible();

    const saveBtn = screen.getByRole("button", { name: /Save changes/ });
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn).toBeVisible();
  });

  it("Should render and display text on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile/edit"]);

    const userEmailEl = screen.getAllByLabelText("Email")[0];

    expect(userEmailEl.querySelector("input")).toBeInTheDocument();
    expect(userEmailEl.querySelector("input")).toBeVisible();

    const userNameInput = screen.getByLabelText(/ime\/korisničko ime/i);

    expect(userNameInput).toBeInTheDocument();
    expect(userNameInput).toBeVisible();

    const saveBtn = screen.getByRole("button", { name: /Spremi/ });
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn).toBeVisible();
  });

  it("Should return email already used", async () => {
    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input")!;
    expect(userEmailInput).toBeInTheDocument();

    fireEvent.change(userEmailInput, {
      target: { value: "userInvalid@gmail.com" },
    });

    const submitBtn = screen.getByRole("button", { name: "Save changes" });
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const messageHere = screen.getByText("Email is already used!");
      expect(messageHere).toBeInTheDocument();
    });
  });

  it("Should return forbidden exception", async () => {
    serviceWorker.use(updateProfileForbiddenRequest);

    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input")!;
    const submitBtn = screen.getByRole("button", { name: "Save changes" });

    expect(userEmailInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(userEmailInput, {
        target: { value: "user123@gmail.com" },
      });
      fireEvent.click(submitBtn);
    });

    setTimeout(() => {
      expect(
        screen.getByText("You are not authorize to access these resources.")
      ).toBeInTheDocument();
    }, 2000);
  });

  it("Should be success", async () => {
    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input")!;
    const submitBtn = screen.getByRole("button", { name: "Save changes" });

    expect(userEmailInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(userEmailInput, {
        target: { value: "user1234@gmail.com" },
      });

      fireEvent.click(submitBtn);
    });

    setTimeout(async () => {
      expect(
        await screen.findByText("Profile successfully updated.")
      ).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
