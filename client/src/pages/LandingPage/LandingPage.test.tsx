import { fireEvent, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";

describe("LandingPage", () => {
  it("Should display Info component text", () => {
    renderWithRouter(["/"]);

    const appName = screen.getByText("Welcome to TaskMaster");
    expect(appName).toBeInTheDocument();
  });

  it("Should display Login form component", async () => {
    renderWithRouter(["/"]);

    const loginFormTitle = await screen.findByText("Log in to Your Account");
    expect(loginFormTitle).toBeInTheDocument();
  });

  it("Should navigate to Signup page", () => {
    renderWithRouter(["/"]);

    const signupBtn = screen.getByLabelText("signup");
    fireEvent.click(signupBtn);

    const signupFormTitle = screen.getByText("Sign up today!");
    expect(signupFormTitle).toBeInTheDocument();
  });

  it("Should display to Signup page", () => {
    renderWithRouter(["/signup"]);

    const signupTitle = screen.getByText("Sign up today!");
    expect(signupTitle).toBeInTheDocument();
  });
});
