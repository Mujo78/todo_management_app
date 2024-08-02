import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

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
  const userSubmitBtn = screen.getByRole("button");

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
    const userSubmitBtn = screen.getByRole("button");

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
