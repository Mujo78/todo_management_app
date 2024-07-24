import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";

describe("ForgotPassword page testing", () => {
  it("Should display info component", () => {
    renderWithRouter(["/forgot-password"]);

    const subTitleInfo = screen.getByText("Forgot Password Instructions");
    expect(subTitleInfo).toBeInTheDocument();
  });

  it("Should display ForgotPasswordForm component", () => {
    renderWithRouter(["/forgot-password"]);

    const titleForgotPasswordForm = screen.getByText("Forgot Your Password?");
    expect(titleForgotPasswordForm).toBeInTheDocument();
  });
});
