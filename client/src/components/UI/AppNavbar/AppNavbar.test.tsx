import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { invalidTokenLogoutHandler } from "../../../msw/handlers";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const openDropdown = () => {
  const btnMe = screen.getByLabelText("account of current user");
  expect(btnMe).toBeInTheDocument();

  fireEvent.click(btnMe);
};

const navigateTo = (linkName: string) => {
  const profileNavLink = screen.getByRole("menuitem", { name: linkName });
  expect(profileNavLink).toBeInTheDocument();

  fireEvent.click(profileNavLink);
};

describe("AppNavbar component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", () => {
    renderWithRouter(["/home"]);
    const nameOfTheApp = screen.getByText("TaskMaster", { selector: "a" });

    expect(nameOfTheApp).toBeInTheDocument();
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
    const todaysDate = new Date().toDateString();

    const dateInTheNavbar = screen.getByText(todaysDate);
    expect(dateInTheNavbar).toBeInTheDocument();
  });

  it("Should open downdrop and navigate to the profile page", () => {
    renderWithRouter(["/home"]);

    openDropdown();
    navigateTo("Profile");

    expect(window.location.pathname === "/profile");
  });

  it("Should open downdrop and navigate to the profile page, then navigate to the home page", () => {
    renderWithRouter(["/home"]);

    openDropdown();
    navigateTo("Profile");
    expect(window.location.pathname === "/profile");

    navigateTo("Home");
    expect(window.location.pathname === "/home");
  });

  it("Should display logout btn in dropdown", () => {
    renderWithRouter(["/home"]);

    openDropdown();

    const logoutBtn = screen.getByRole("menuitem", { name: "Log out" });
    expect(logoutBtn).toBeInTheDocument();
  });

  it("Should return Invalid token provided message when trying logout", async () => {
    serviceWorker.use(invalidTokenLogoutHandler);
    renderWithRouter(["/home"]);

    openDropdown();

    const logoutBtn = screen.getByRole("menuitem", { name: "Log out" });
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

    const logoutBtn = screen.getByRole("menuitem", { name: "Log out" });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);

    expect(window.location.pathname === "/");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
