import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, it } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";

const loginWithErrors = async (
  expectedMessage: string,
  email: string,
  password: string
) => {
  renderWithRouter(["/"]);

  const userEmailInput = screen.getByLabelText("Email").querySelector("input")!;
  const userPasswordInput = screen
    .getByTestId("Password")
    .querySelector("input")!;
  const userSubmitBtn = screen.getByLabelText("loginBtn");

  fireEvent.change(userEmailInput, {
    target: { value: email },
  });
  fireEvent.change(userPasswordInput, {
    target: { value: password },
  });

  fireEvent.click(userSubmitBtn);

  expect(userEmailInput.value).toBe(email);
  expect(userPasswordInput.value).toBe(password);

  await waitFor(async () => {
    expect(await screen.findByText(expectedMessage)).toBeInTheDocument();
  });
};

describe("LoginFrom component tests", () => {
  beforeEach(async () => {
    changeLng("eng");
  });
  it("Should render and display on english language", () => {
    renderWithRouter(["/"]);

    const loginFormTitle = screen.getByText("Log in to Your Account");
    const submitBtn = screen.getByLabelText("loginBtn");
    const forgotPasswordLink = screen.getByRole("link");

    expect(loginFormTitle).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveTextContent("Forgot Password?");
  });

  it("Should display on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/"]);

    const loginFormTitle = screen.getByText("Prijavite se na Vaš račun");
    const submitBtn = screen.getByLabelText("loginBtn");
    const forgotPasswordLink = screen.getByRole("link");

    expect(loginFormTitle).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent("Prijava");
    expect(forgotPasswordLink).toHaveTextContent("Zaboravljena lozinka?");
  });

  it("Should navigate to the forgot password page", () => {
    renderWithRouter(["/"]);

    const forgotPasswordLink = screen.getByRole("link");
    fireEvent.click(forgotPasswordLink);

    const forgotPasswordTitle = screen.getByText("Forgot Your Password?");
    expect(forgotPasswordTitle).toBeInTheDocument();
  });

  it.each([
    [
      "Account doesn't exists.",
      "incorrectEmail@gmail.com",
      "incorrectPassword",
    ],
    ["Incorrect email or password.", "correct@gmail.com", "incorrectPassword"],
  ])(
    "Should render error: `%s` message when login",
    (expected, input, inputSecond) => {
      loginWithErrors(expected, input, inputSecond);
    }
  );

  it("Should be success", async () => {
    renderWithRouter(["/"]);

    const userEmailInput = screen
      .getByLabelText("Email")
      .querySelector("input")!;
    const userPasswordInput = screen
      .getByTestId("Password")
      .querySelector("input")!;
    const userSubmitBtn = screen.getByLabelText("loginBtn");

    fireEvent.change(userEmailInput, {
      target: { value: "correct@gmail.com" },
    });
    fireEvent.change(userPasswordInput, {
      target: { value: "correctPassword" },
    });

    fireEvent.click(userSubmitBtn);

    expect(userEmailInput.value).toBe("correct@gmail.com");
    expect(userPasswordInput.value).toBe("correctPassword");

    await waitFor(() => {
      const userName = screen.getByText("Test Correct One");
      expect(userName).toBeInTheDocument();
    });
  });
});
