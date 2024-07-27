import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";

describe("Error Page component testing", () => {
  beforeEach(() => {
    renderWithRouter(["/****"]);
  });

  it("Should render not found page error", () => {
    const errorMessage = screen.getByText("Page not found", { selector: "h4" });
    expect(errorMessage).toBeInTheDocument();
  });

  it("Should navigate to the home/login page", async () => {
    const homeLink = screen.getByText("Home", { selector: "a" });
    expect(homeLink).toBeInTheDocument();

    fireEvent.click(homeLink);

    await waitFor(() => {
      const loginFormTitle = screen.getByText("Log in to Your Account");
      expect(loginFormTitle).toBeInTheDocument();
    });
  });
});
