import { screen } from "@testing-library/react";
import { it, describe, beforeEach } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../helpers/tests/HelperTestsFunctions";

describe("ResetPassword page component testing", () => {
  beforeEach(async () => {
    await changeLng("eng");
  });

  it("Should render and display on english language", () => {
    renderWithRouter(["/password-reset/:token"]);

    const resetPasswordTitle = screen.getByText("Reset Password");
    const textFirst = screen.getByText(
      /create a new password that you don't use on any other site/i
    );
    const textSecond = screen.getByText(
      /strong password contains letters, numbers and special characters/i
    );

    expect(resetPasswordTitle).toBeInTheDocument();
    expect(textFirst).toBeInTheDocument();
    expect(textSecond).toBeInTheDocument();
  });

  it("Should render and display on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/password-reset/:token"]);

    const resetPasswordTitle = screen.getByText("Poništi Lozinku");
    const textFirst = screen.getByText(
      /kreirajte novu lozinku koju ne koristite ni na jednoj drugoj stranici/i
    );
    const textSecond = screen.getByText(
      /jaka lozinka sadrži slova, brojeve i specijalne znakove/i
    );

    expect(resetPasswordTitle).toBeInTheDocument();
    expect(textFirst).toBeInTheDocument();
    expect(textSecond).toBeInTheDocument();
  });

  it("Should display ResetPasswordForm component", () => {
    renderWithRouter(["/password-reset/:token"]);

    const newPasswordElement = screen
      .getByTestId("New Password")
      .querySelector("input");
    expect(newPasswordElement).toBeInTheDocument();
  });
});
