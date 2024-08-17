import { describe, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

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
  it("Should be displayed on login page", () => {
    renderWithRouter(["/"]);
    checkForOptions();
  });

  it("Should be displayed on signup page", () => {
    renderWithRouter(["/signup"]);
    checkForOptions();
  });

  it("Should be displayed on forgotPassword page", () => {
    renderWithRouter(["/forgot-password"]);
    checkForOptions();
  });

  it("Should be displayed on verifyEmail page", () => {
    renderWithRouter(["/verify-email/:token"]);
    checkForOptions();
  });

  it("Should be displayed on resetPassword page", () => {
    renderWithRouter(["/password-reset/:token"]);
    checkForOptions();
  });
});
