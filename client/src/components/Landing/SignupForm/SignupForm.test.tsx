import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

const signupBaseFn = async (
  email: string,
  name: string,
  password: string,
  confirmPassword: string,
  errorMessage: string
) => {
  renderWithRouter(["/signup"]);

  const userNameInput = screen.getByLabelText("Name").querySelector("input")!;
  const userEmailInput = screen.getByLabelText("Email").querySelector("input")!;

  const passwordInput = screen.getByTestId("Password").querySelector("input")!;

  const newPasswordInput = screen
    .getByTestId("Confirm Password")
    .querySelector("input")!;

  const userSubmitBtn = screen.getByLabelText("signupBtn");

  fireEvent.input(userNameInput, {
    target: { value: name },
  });
  fireEvent.input(userEmailInput, {
    target: { value: email },
  });

  fireEvent.input(passwordInput, {
    target: { value: password },
  });
  fireEvent.input(newPasswordInput, {
    target: { value: confirmPassword },
  });

  fireEvent.click(userSubmitBtn);

  await waitFor(() => {
    const message = screen.getByText(errorMessage);
    expect(message).toBeInTheDocument();
  });
};

describe("SignupForm component tests", () => {
  it("Should render", () => {
    renderWithRouter(["/signup"]);

    const signupFormTitle = screen.getByText("Sign up today!");
    expect(signupFormTitle).toBeInTheDocument();
  });

  it.each([
    [
      "Passwords must match",
      "user@gmail.com",
      "Name goes here.",
      "Password&1234567",
      "Password&123456",
    ],
    [
      "Email is already used!",
      "correctOne@gmail.com",
      "Name goes here.",
      "Password&1234567",
      "Password&1234567",
    ],
    [
      "Invalid email address, please provide valid email to create an account.",
      "admin@gmail.com",
      "Admin user create",
      "Password&1234567",
      "Password&1234567",
    ],
    [
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "user@gmail.com",
      "User One Created",
      "Password",
      "Password",
    ],
    [
      "Name must be at least 5 characters long.",
      "user@gmail.com",
      "Adm",
      "Password",
      "Password",
    ],
    [
      "Password must be at least 8 characters long.",
      "user@gmail.com",
      "User One Created",
      "Pass",
      "Pass",
    ],
  ])(
    "Should render error: `%s` ",
    async (expected, email, name, password, confirmPassword) => {
      await signupBaseFn(email, name, password, confirmPassword, expected);
    }
  );

  it("Should be success", async () => {
    await signupBaseFn(
      "user@gmail.com",
      "User One Test",
      "Password&12345",
      "Password&12345",
      "Please check your inbox for verification email."
    );
  });
});
