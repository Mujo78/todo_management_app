import { fireEvent, render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { BrowserRouter } from "react-router-dom";
import { describe, it } from "vitest";
import { renderWithRouter } from "../helpers/tests/HelperTestsFunctions";

describe("LandingPage", () => {
  it("Should display Info component text", () => {
    render(<LandingPage />, { wrapper: BrowserRouter });

    const appName = screen.getByText("Welcome to TaskMaster");
    expect(appName).toBeInTheDocument();
  });

  it("Should display Login form component", async () => {
    renderWithRouter(["/"]);

    const loginFormTitle = await screen.findByText("Log in to Your Account");
    expect(loginFormTitle).toBeInTheDocument();
  });

  it("Should navigate to Signup page", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const signupBtn = screen.getByLabelText("signup");
    fireEvent.click(signupBtn);

    expect(window.location.pathname).toBe("/signup");
  });

  it("Should display to Signup page", () => {
    renderWithRouter(["/signup"]);

    const signupTitle = screen.getByText("Sign up today!");
    expect(signupTitle).toBeInTheDocument();
  });
});
