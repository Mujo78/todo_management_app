import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";

describe("ForgotPasswordInfo component testing - localization", () => {
  it("Should display text on english by default", () => {
    renderWithRouter(["/forgot-password"]);
    const title = screen.getByText("TaskMaster");
    const subtitle = screen.getByText("Forgot Password Instructions");
    const text = screen.getByText(
      "Enter the email address associated with your account and we'll send you a link to reset your password."
    );

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("Should display text on english by default", async () => {
    await changeLng("bs");
    renderWithRouter(["/forgot-password"]);

    const title = screen.getByText("TaskMaster");
    const subtitle = screen.getByText("Uputstva");
    const text = screen.getByText(
      "Unesite email adresu koja je povezana sa vašim računom i mi ćemo vam poslati link za resetovanje vaše lozinke."
    );

    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });
});
