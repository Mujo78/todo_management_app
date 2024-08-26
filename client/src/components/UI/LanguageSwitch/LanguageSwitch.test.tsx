import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import {
  changeLng,
  chooseLngFromDropdown,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";

const openLngDropdown = () => {
  const lngBtn = screen.getByLabelText("LanguageBtn");
  expect(lngBtn).toBeInTheDocument();

  fireEvent.click(lngBtn);
};

const checkForOptions = () => {
  openLngDropdown();

  const englishLngItem = screen.getByLabelText("EnglishLngItem");
  const bosnianLngItem = screen.getByLabelText("BosnianLngItem");

  expect(englishLngItem).toBeVisible();
  expect(bosnianLngItem).toBeVisible();
};

describe("LanguageSwitch component testing", () => {
  beforeEach(async () => {
    await changeLng("eng");
  });

  it("Should be displayed on login page", () => {
    renderWithRouter(["/"]);

    expect(screen.getByText("Log in to Your Account")).toBeVisible();
    checkForOptions();
  });

  it("Should change language to bosnian on login page", () => {
    renderWithRouter(["/"]);
    chooseLngFromDropdown("BosnianLngItem");

    expect(screen.getByText("Prijavite se na Vaš račun")).toBeVisible();
  });

  it("Should be displayed on signup page", () => {
    renderWithRouter(["/signup"]);
    expect(screen.getByText("Sign up today!")).toBeVisible();
    checkForOptions();
  });

  it("Should change language to bosnian on signup page", () => {
    renderWithRouter(["/signup"]);
    chooseLngFromDropdown("BosnianLngItem");

    expect(screen.getByText("Registrujte se danas!")).toBeVisible();
  });

  it("Should be displayed on forgotPassword page", () => {
    renderWithRouter(["/forgot-password"]);
    expect(screen.getByText("Forgot Your Password?")).toBeVisible();
    checkForOptions();
  });

  it("Should change language to bosnian on forgotPassword page", () => {
    renderWithRouter(["/forgot-password"]);
    chooseLngFromDropdown("BosnianLngItem");

    expect(screen.getByText("Zaboravili ste lozinku?")).toBeVisible();
  });

  it("Should be displayed on verifyEmail page", () => {
    renderWithRouter(["/verify-email/:token"]);
    expect(screen.getByText("Verify your email address")).toBeVisible();
    checkForOptions();
  });

  it("Should change language to bosnian on verifyEmail page", () => {
    renderWithRouter(["/verify-email/:token"]);
    chooseLngFromDropdown("BosnianLngItem");

    expect(screen.getByText("Potvrdite svoju email adresu")).toBeVisible();
  });

  it("Should be displayed on resetPassword page", () => {
    renderWithRouter(["/password-reset/:token"]);
    expect(screen.getByText("Reset Password")).toBeVisible();
    checkForOptions();
  });

  it("Should change language to bosnian on resetPassword page", () => {
    renderWithRouter(["/password-reset/:token"]);
    chooseLngFromDropdown("BosnianLngItem");

    expect(screen.getByText("Poništi Lozinku")).toBeVisible();
  });
});
