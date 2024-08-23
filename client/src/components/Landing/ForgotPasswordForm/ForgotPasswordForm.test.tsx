import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

const forgotPasswordBaseFn = async (email: string, expected: string) => {
  renderWithRouter(["/forgot-password"]);

  const emailInput = screen.getByLabelText("Email").querySelector("input")!;
  const submitButton = screen.getByRole("button", { name: "Submit" });

  fireEvent.change(emailInput, {
    target: {
      value: email,
    },
  });

  fireEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getByText(expected);
    expect(errorMessage).toBeInTheDocument();
  });
};

describe("Forgot Password Form component testing", () => {
  it("Should render form input for an email", () => {
    renderWithRouter(["/forgot-password"]);

    const emailInput = screen.getByLabelText("Email").querySelector("input");
    expect(emailInput).toBeInTheDocument();
  });

  it("Should go back to the login page", () => {
    renderWithRouter(["/forgot-password"]);

    const goBackButton = screen.getByLabelText("goBackBtn");
    expect(goBackButton).toBeInTheDocument();

    fireEvent.click(goBackButton);

    const loginFormTitle = screen.getByText("Log in to Your Account");
    expect(loginFormTitle).toBeInTheDocument();
  });

  it.each([
    [
      "Reset password link already created. Please check your inbox.",
      "correctButAlreadyCreated@gmail.com",
    ],
    ["User not found.", "incorrect@gmail.com"],
  ])("Should return error message: `%s` ", async (expected, email) => {
    await forgotPasswordBaseFn(email, expected);
  });

  it("Should be success", async () => {
    await forgotPasswordBaseFn(
      "correct@gmail.com",
      "Check your email inbox to proceed with restarting your password."
    );
  });
});
