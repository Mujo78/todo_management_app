import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import {
  changeLng,
  openDropdownAndChooseLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { invalidTokenLogoutHandler } from "../../../msw/handlers";
import { format } from "date-fns";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const openDropdown = () => {
  const btnMe = screen.getByLabelText("account of current user");
  expect(btnMe).toBeInTheDocument();

  fireEvent.click(btnMe);
};

const navigateTo = (labelName: string) => {
  const profileNavLink = screen.getByLabelText(labelName);
  expect(profileNavLink).toBeInTheDocument();

  fireEvent.click(profileNavLink);
};

describe("AppNavbar component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should render and display elements on english language", () => {
    renderWithRouter(["/home"]);
    const nameOfTheApp = screen.getByText("TaskMaster", { selector: "a" });
    const dropDownBtn = screen.getByLabelText("account of current user");

    openDropdown();

    const profileNavLink = screen.getByLabelText("ProfileLink");
    const homeNavLink = screen.getByLabelText("HomeLink");
    const lngBtn = screen.getByLabelText("LanguageBtn");
    const logoutBtn = screen.getByLabelText("LogoutBtnLink");

    expect(nameOfTheApp).toBeInTheDocument();
    expect(dropDownBtn).toHaveTextContent("Me");

    expect(profileNavLink).toBeInTheDocument();
    expect(profileNavLink).toHaveTextContent("Profile");

    expect(homeNavLink).toBeInTheDocument();
    expect(homeNavLink).toHaveTextContent("Home");

    expect(lngBtn).toBeInTheDocument();
    expect(lngBtn).toHaveTextContent("Language");

    expect(logoutBtn).toBeInTheDocument();
    expect(logoutBtn).toHaveTextContent("Log out");
  });

  it("Should open language dropdown and show options on english language", () => {
    renderWithRouter(["/home"]);
    openDropdown();

    const lngBtn = screen.getByLabelText("LanguageBtn");

    expect(lngBtn).toBeInTheDocument();
    expect(lngBtn).toHaveTextContent("Language");

    fireEvent.click(lngBtn);

    const englishNavBtn = screen.getByLabelText("EnglishLngItem");
    const bosnianNavBtn = screen.getByLabelText("BosnianLngItem");

    expect(englishNavBtn).toBeInTheDocument();
    expect(englishNavBtn).toHaveTextContent("English");
    expect(bosnianNavBtn).toBeInTheDocument();
    expect(bosnianNavBtn).toHaveTextContent("Bosnian");
  });

  it("Should render, open dropdown and display text on bosnian language", async () => {
    await changeLng("bs");

    renderWithRouter(["/home"]);
    const nameOfTheApp = screen.getByText("TaskMaster", { selector: "a" });
    const dropDownBtn = screen.getByLabelText("account of current user");

    openDropdown();

    const profileNavLink = screen.getByLabelText("ProfileLink");
    const homeNavLink = screen.getByLabelText("HomeLink");
    const lngBtn = screen.getByLabelText("LanguageBtn");
    const logoutBtn = screen.getByLabelText("LogoutBtnLink");

    expect(nameOfTheApp).toBeInTheDocument();
    expect(dropDownBtn).toHaveTextContent("Ja");

    expect(profileNavLink).toBeInTheDocument();
    expect(profileNavLink).toHaveTextContent("Profil");

    expect(homeNavLink).toBeInTheDocument();
    expect(homeNavLink).toHaveTextContent("Početna");

    expect(lngBtn).toBeInTheDocument();
    expect(lngBtn).toHaveTextContent("Jezik");

    expect(logoutBtn).toBeInTheDocument();
    expect(logoutBtn).toHaveTextContent("Odjava");
  });

  it("Should open language dropdown and display options on bosnian language", async () => {
    await changeLng("bs");

    renderWithRouter(["/home"]);
    openDropdown();

    const lngBtn = screen.getByLabelText("LanguageBtn");

    expect(lngBtn).toBeInTheDocument();
    expect(lngBtn).toHaveTextContent("Jezik");

    fireEvent.click(lngBtn);

    const englishNavBtn = screen.getByLabelText("EnglishLngItem");
    const bosnianNavBtn = screen.getByLabelText("BosnianLngItem");

    expect(englishNavBtn).toBeInTheDocument();
    expect(englishNavBtn).toHaveTextContent("Engleski");
    expect(bosnianNavBtn).toBeInTheDocument();
    expect(bosnianNavBtn).toHaveTextContent("Bosanski");
  });

  it("Should change language to bosnian", async () => {
    renderWithRouter(["/home"]);
    openDropdown();

    openDropdownAndChooseLng("BosnianLngItem");

    await waitFor(() => {
      const homeNavLink = screen.getByLabelText("HomeLink");

      expect(homeNavLink).toBeInTheDocument();
      expect(homeNavLink).toHaveTextContent("Početna");
    });
  });

  it("Should navigate when click navbar name of the app", () => {
    renderWithRouter(["/profile"]);
    const nameOfTheApp = screen.getByText("TaskMaster", { selector: "a" });
    expect(nameOfTheApp).toBeInTheDocument();

    fireEvent.click(nameOfTheApp);
    expect(window.location.pathname === "/home");
  });

  it("Should display todays date on larger screens", () => {
    renderWithRouter(["/home"]);
    const todaysDate = format(new Date(), "dd/MM/yyyy");

    const dateInTheNavbar = screen.getByText(todaysDate);
    expect(dateInTheNavbar).toBeInTheDocument();
  });

  it("Should open downdrop and navigate to the profile page", () => {
    renderWithRouter(["/home"]);

    openDropdown();
    navigateTo("ProfileLink");

    expect(window.location.pathname === "/profile");
  });

  it("Should open downdrop and navigate to the profile page, then navigate to the home page", () => {
    renderWithRouter(["/home"]);

    openDropdown();
    navigateTo("ProfileLink");
    expect(window.location.pathname === "/profile");

    navigateTo("HomeLink");
    expect(window.location.pathname === "/home");
  });

  it("Should display logout btn in dropdown", () => {
    renderWithRouter(["/home"]);

    openDropdown();

    const logoutBtn = screen.getByLabelText("LogoutBtnLink");
    expect(logoutBtn).toBeInTheDocument();
  });

  it("Should return Invalid token provided message when trying logout", async () => {
    serviceWorker.use(invalidTokenLogoutHandler);
    renderWithRouter(["/home"]);

    openDropdown();

    const logoutBtn = screen.getByLabelText("LogoutBtnLink");
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    await waitFor(async () => {
      expect(
        await screen.findByText("Invalid token provided. Token not found.")
      ).toBeInTheDocument();
    });
  });

  it("Should logout successfully", async () => {
    renderWithRouter(["/home"]);

    openDropdown();

    const logoutBtn = screen.getByLabelText("LogoutBtnLink");
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    expect(window.location.pathname === "/");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
