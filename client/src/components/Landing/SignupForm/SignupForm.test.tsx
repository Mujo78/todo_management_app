import { screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

describe("SignupForm component tests", () => {
  it("Should render", () => {
    renderWithRouter(["/signup"]);

    const signupFormTitle = screen.getByText("Sign up today!");
    expect(signupFormTitle).toBeInTheDocument();
  });
});
