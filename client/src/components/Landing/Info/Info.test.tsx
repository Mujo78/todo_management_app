import { describe } from "vitest";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { screen } from "@testing-library/react";

describe("Info component testing - localization", () => {
  it("Should display text on english language by default", () => {
    renderWithRouter(["/"]);

    const title = screen.getByText("Welcome to TaskMaster");
    const text = screen.getByText(
      "Boost your productivity with TaskMaster. Create, organize, and track your tasks effortlessly."
    );
    const subtitle = screen.getByText("Why TaskMaster?");
    const lastSentence = screen.getByText(
      "Join thousands of users taking control of their tasks today!"
    );

    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(lastSentence).toBeInTheDocument();
  });

  it("Should display text on bosnian language after changing", async () => {
    await changeLng("bs");

    renderWithRouter(["/"]);

    const title = screen.getByText("Dobrodošli u TaskMaster");
    const text = screen.getByText(
      "Povećajte svoju produktivnost uz TaskMaster. Kreirajte, organizirajte i pratite svoje zadatke bez napora."
    );
    const subtitle = screen.getByText("Zašto TaskMaster?");
    const lastSentence = screen.getByText(
      "Pridružite se hiljadama korisnika koji preuzimaju kontrolu nad svojim zadacima već danas!"
    );

    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(lastSentence).toBeInTheDocument();
  });
});
