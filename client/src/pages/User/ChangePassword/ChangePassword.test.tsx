import { beforeEach, describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { changePasswordUserNotFoundRequest } from "../../../msw/authHandlers";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseChangePasswordFn = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  renderWithRouter(["/profile/change-password"]);

  const oldPasswordElement = screen
    .getByTestId("Password")
    .querySelector("input")!;

  const newPasswordElement = screen
    .getByTestId("New Password")
    .querySelector("input")!;

  const confirmPasswordElement = screen
    .getByTestId("Confirm New Password")
    .querySelector("input")!;

  const submitBtn = screen.getByRole("button", { name: "Save changes" });

  expect(oldPasswordElement).toBeInTheDocument();
  expect(newPasswordElement).toBeInTheDocument();
  expect(confirmPasswordElement).toBeInTheDocument();
  expect(submitBtn).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(oldPasswordElement, { target: { value: oldPassword } });
    fireEvent.change(newPasswordElement, { target: { value: newPassword } });
    fireEvent.change(confirmPasswordElement, {
      target: { value: confirmPassword },
    });

    fireEvent.click(submitBtn);
  });
};

describe("Change Password component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", () => {
    renderWithRouter(["/profile/change-password"]);
    const newPasswordElement = screen
      .getByTestId("New Password")
      .querySelector("input");
    expect(newPasswordElement).toBeInTheDocument();
  });

  it.each([
    [
      "Password must be at least 8 characters long.",
      "Password&12345",
      "Pass",
      "Pass",
    ],
    [
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "Password&12345",
      "Password",
      "Password",
    ],
    [
      "Confirm Password must match with new password.",
      "Password&12345",
      "Password&123456",
      "Password&12345",
    ],
    [
      "Wrong old password.",
      "Password&1234567",
      "Password&12345",
      "Password&12345",
    ],
    [
      "New password cannot be the same as the old password.",
      "Password&12345",
      "Password&12345",
      "Password&12345",
    ],
  ])(
    "Should return message: `%s`",
    async (expected, oldPass, newPass, confirmPass) => {
      await baseChangePasswordFn(oldPass, newPass, confirmPass);

      await waitFor(() => {
        const expectedMessage = screen.getByText(expected);
        expect(expectedMessage).toBeInTheDocument();
      });
    }
  );

  it("Should return User not found", async () => {
    serviceWorker.use(changePasswordUserNotFoundRequest);

    await baseChangePasswordFn(
      "Password&123456",
      "Password&12345",
      "Password&12345"
    );

    setTimeout(async () => {
      expect(await screen.findByText("User not found.")).toBeInTheDocument();
    }, 2000);
  });

  it("Should be success", async () => {
    await baseChangePasswordFn(
      "Password&123456",
      "Password&12345",
      "Password&12345"
    );

    setTimeout(async () => {
      expect(
        await screen.findByText("Password successfully changed.")
      ).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
