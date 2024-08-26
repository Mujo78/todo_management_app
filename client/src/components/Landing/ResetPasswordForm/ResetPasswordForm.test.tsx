import { beforeEach, describe } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { serviceWorker } from "../../../msw/Worker";
import {
  resetPasswordHandler,
  resetPasswordInvalidTokenNotFoundedUserHandler,
  resetPasswordNotValidToken,
} from "../../../msw/handlers";

const resetPasswordBaseFn = (
  newPassword: string,
  confirmNewPassword: string
) => {
  renderWithRouter(["/password-reset/:token"]);

  const newPasswordField = screen
    .getByTestId("New Password")
    .querySelector("input")!;

  const confirmPasswordField = screen
    .getByTestId("Confirm Password")
    .querySelector("input")!;

  const submitBtn = screen.getByRole("button", { name: "Submit" });

  fireEvent.change(newPasswordField, {
    target: { value: newPassword },
  });
  fireEvent.change(confirmPasswordField, {
    target: { value: confirmNewPassword },
  });

  fireEvent.click(submitBtn);
};

describe("Reset Password Form component testing", () => {
  beforeEach(async () => {
    await changeLng("eng");
  });
  it("Should render and display on english language", () => {
    renderWithRouter(["/password-reset/:token"]);

    const newPasswordFieldLabel = screen.getByLabelText("New Password");
    const confirmNewPasswordFieldLabel =
      screen.getByLabelText("Confirm Password");

    expect(newPasswordFieldLabel).toBeInTheDocument();
    expect(confirmNewPasswordFieldLabel).toBeInTheDocument();
  });

  it("Should render and display on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/password-reset/:token"]);

    const newPasswordFieldLabel = screen.getByLabelText("Nova Lozinka");
    const confirmNewPasswordFieldLabel =
      screen.getByLabelText("Potvrdi Lozinku");

    expect(newPasswordFieldLabel).toBeInTheDocument();
    expect(confirmNewPasswordFieldLabel).toBeInTheDocument();
  });

  it.each([
    ["Password must be at least 8 characters long.", "Pass", "Pass"],
    [
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "Password",
      "Password",
    ],
    [
      "New password cannot be the same as the old password.",
      "sameOldPassword&12345",
      "sameOldPassword&12345",
    ],
  ])(
    "Should return message: `%s`",
    async (expected, newPassword, confirmPassword) => {
      resetPasswordBaseFn(newPassword, confirmPassword);

      await waitFor(() => {
        const expectedError = screen.getByText(expected);
        expect(expectedError).toBeInTheDocument();
      });
    }
  );

  it.each([
    ["Invalid token provided. Token not found.", resetPasswordHandler],
    ["Invalid token provided.", resetPasswordNotValidToken],
    ["User not found.", resetPasswordInvalidTokenNotFoundedUserHandler],
  ])("Should return message: `%s` ", async (expectedText, handler) => {
    serviceWorker.use(handler);

    resetPasswordBaseFn("Password&12345", "Password&12345");

    await waitFor(() => {
      const expectedMessage = screen.getByText(expectedText);
      expect(expectedMessage).toBeInTheDocument();
    });
  });

  it("Should be success", async () => {
    resetPasswordBaseFn("Password&12345", "Password&12345");

    await waitFor(() => {
      const expectedMessage = screen.getByText(
        "Password successfully changed."
      );
      expect(expectedMessage).toBeInTheDocument();
    });
  });
});
