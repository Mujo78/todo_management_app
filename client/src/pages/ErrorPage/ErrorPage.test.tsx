import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../helpers/tests/HelperTestsFunctions";

describe("Error Page component testing", () => {
  beforeEach(async () => {
    await changeLng("eng");
    renderWithRouter(["/****"]);
  });

  it("Should render not found page error on english language", () => {
    const errorTitle = screen.getByText("Page not found", { selector: "h4" });
    const errorMessage = screen.getByText(
      "Sorry, we couldn't find the page you're looking for.",
      { selector: "p" }
    );
    const homeLink = screen.getByText("Home", { selector: "a" });
    const contactUsLink = screen.getByText("Contact Us", { selector: "a" });

    expect(errorTitle).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(contactUsLink).toBeInTheDocument();
  });

  it("Should render not found page error on bosnian language", async () => {
    await act(async () => {
      await changeLng("bs");
    });
    renderWithRouter(["/****"]);

    const errorTitle = screen.getAllByText("Stranica nije pronađena", {
      selector: "h4",
    });
    const errorMessage = screen.getAllByText(
      "Žao nam je, nismo mogli pronaći stranicu koju tražite.",
      { selector: "p" }
    );
    const homeLink = screen.getAllByText("Početna", { selector: "a" });
    const contactUsLink = screen.getAllByText("Kontaktirajte nas", {
      selector: "a",
    });

    expect(errorTitle[0]).toBeInTheDocument();
    expect(errorMessage[0]).toBeInTheDocument();
    expect(homeLink[0]).toBeInTheDocument();
    expect(contactUsLink[0]).toBeInTheDocument();
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
