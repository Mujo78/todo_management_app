import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { updateProfileForbiddenRequest } from "../../../msw/authHandlers";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Edit Profile component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    renderWithRouter(["/profile/edit"]);
  });

  it("Should render", () => {
    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input");
    expect(userEmailInput).toBeInTheDocument();
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

  it("Should return forbidden exception", () => {
    serviceWorker.use(updateProfileForbiddenRequest);

    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input")!;
    expect(userEmailInput).toBeInTheDocument();

    fireEvent.change(userEmailInput, {
      target: { value: "user123@gmail.com" },
    });

    const submitBtn = screen.getByRole("button", { name: "Save changes" });
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

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
    expect(userEmailInput).toBeInTheDocument();

    fireEvent.change(userEmailInput, {
      target: { value: "user1234@gmail.com" },
    });

    const submitBtn = screen.getByRole("button", { name: "Save changes" });
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

    setTimeout(() => {
      expect(
        screen.getByText("Profile successfully updated.")
      ).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
