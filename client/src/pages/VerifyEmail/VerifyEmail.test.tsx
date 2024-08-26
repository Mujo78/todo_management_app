import { beforeEach, describe, expect } from "vitest";
import {
  verifyEmailInvalidTokenHandler,
  verifyEmailTokenNotFoundHandler,
  verifyEmailTokenUserNotFoundHandler,
} from "../../msw/handlers";
import {
  changeLng,
  renderWithRouter,
} from "../../helpers/tests/HelperTestsFunctions";
import { serviceWorker } from "../../msw/Worker";
import { screen, waitFor } from "@testing-library/react";

describe("Verify Email component testing", () => {
  beforeEach(async () => {
    await changeLng("eng");
  });

  it("Should render and display on english language", () => {
    renderWithRouter(["/verify-email/:token"]);

    const subtitle = screen.getByText("Verify your email address");
    const text = screen.getByText(
      "By verifying your email, you will confirm that you want to use this as your TaskMaster account email address. Once it's done you will be able to start with creating and achieving your daily goals."
    );

    expect(subtitle).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it("Should render and display on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/verify-email/:token"]);

    const subtitle = screen.getByText("Potvrdite svoju email adresu");
    const text = screen.getByText(
      "Potvrdom vaše e-pošte, potvrdit ćete da ovu želite koristiti kao adresu e-pošte vašeg TaskMaster naloga. Kada to bude gotovo, moći ćete početi sa kreiranjem i postizanjem svojih dnevnih ciljeva."
    );

    expect(subtitle).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

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
