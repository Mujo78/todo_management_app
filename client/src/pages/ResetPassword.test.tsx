import { screen } from "@testing-library/react";
import { it, describe } from "vitest";
import { renderWithRouter } from "../helpers/tests/HelperTestsFunctions";

describe("ResetPassword page component testing", () => {
  it("Should render", () => {
    renderWithRouter(["/password-reset/:token"]);

    const resetPasswordTitle = screen.getByText("Reset Password");
    expect(resetPasswordTitle).toBeInTheDocument();
  });

  it("Should display ResetPasswordForm component", () => {
    renderWithRouter(["/password-reset/:token"]);

    const newPasswordElement = screen
      .getByTestId("New Password")
      .querySelector("input");
    expect(newPasswordElement).toBeInTheDocument();
  });
});
