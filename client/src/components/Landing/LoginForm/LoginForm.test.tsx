import { fireEvent, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

describe("LoginFrom component tests", () => {
  it("Should render", () => {
    renderWithRouter(["/"]);

    const loginFormTitle = screen.getByText("Log in to Your Account");
    expect(loginFormTitle).toBeInTheDocument();
  });

  it("Should navigate to the forgot password page", () => {
    renderWithRouter(["/"]);

    const forgotPasswordLink = screen.getByRole("link");
    fireEvent.click(forgotPasswordLink);

    const forgotPasswordTitle = screen.getByText("Forgot Your Password?");
    expect(forgotPasswordTitle).toBeInTheDocument();
  });
});
