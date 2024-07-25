import { describe, expect } from "vitest";
import {
  verifyEmailInvalidTokenHandler,
  verifyEmailTokenNotFoundHandler,
  verifyEmailTokenUserNotFoundHandler,
} from "../../msw/handlers";
import { renderWithRouter } from "../../helpers/tests/HelperTestsFunctions";
import { serviceWorker } from "../../msw/Worker";
import { screen, waitFor } from "@testing-library/react";

describe("Verify Email component testing", () => {
  it.each([
    [
      "Invalid token provided. Token not found.",
      verifyEmailTokenNotFoundHandler,
    ],
    ["Invalid token provided.", verifyEmailInvalidTokenHandler],
    ["User not found.", verifyEmailTokenUserNotFoundHandler],
  ])("Should return message: `%s`", async (message, handler) => {
    serviceWorker.use(handler);

    renderWithRouter(["/verify-email/:token"]);

    await waitFor(() => {
      const expectedMessage = screen.getByText(message);
      expect(expectedMessage).toBeInTheDocument();
    });
  });

  it("Should be success", async () => {
    renderWithRouter(["/verify-email/:token"]);

    await waitFor(() => {
      const expectedMessage = screen.getByText(
        "Successfully verified email address."
      );
      expect(expectedMessage).toBeInTheDocument();
    });
  });
});
