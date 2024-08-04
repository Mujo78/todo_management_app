import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const makeToMobileScreen = () => {
  global.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === "(max-width:600px)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("TabNavigation component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    makeToMobileScreen();
  });

  it("Should render", async () => {
    renderWithRouter(["/home"]);

    const tabNavigation = await screen.findByLabelText("bottomNavigation");
    expect(tabNavigation).toBeInTheDocument();
  });

  it("Should navigate to the add new task page", async () => {
    renderWithRouter(["/home"]);

    const addTabBtn = await screen.findByLabelText("TabNavBtnAdd");
    expect(addTabBtn).toBeInTheDocument();

    fireEvent.click(addTabBtn);

    expect(window.location.pathname === "/add-task");
  });

  it("Should navigate to the profile page", async () => {
    renderWithRouter(["/home"]);

    const profileTabBtn = await screen.findByLabelText("TabNavBtnProfile");
    expect(profileTabBtn).toBeInTheDocument();

    fireEvent.click(profileTabBtn);

    expect(window.location.pathname === "/profile");
  });

  it("Should navigate to the home page", async () => {
    renderWithRouter(["/profile"]);

    const homeTabBtn = await screen.findByLabelText("TabNavBtnTasks");
    expect(homeTabBtn).toBeInTheDocument();

    fireEvent.click(homeTabBtn);

    expect(window.location.pathname === "/home");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
