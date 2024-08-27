import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { fireEvent, screen } from "@testing-library/react";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

const makeToPCScreen = () => {
  global.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === "(min-width:1200px)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("AppSidebar component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
    makeToPCScreen();
  });

  it("Should render", () => {
    renderWithRouter(["/home"]);

    const userName = screen.getByText("User Test One");
    expect(userName).toBeInTheDocument();
  });

  it("Should display text on english language", () => {
    renderWithRouter(["/home"]);

    const profileLink = screen.getByLabelText("profile-text");
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveTextContent("Profile");

    const homeLink = screen.getByLabelText("tasks-text");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent("Tasks");

    const addBtn = screen.getByLabelText("addNewTaskBtn");
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent("Add a new task");
  });

  it("Should display text on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/home"]);

    const profileLink = screen.getByLabelText("profile-text");
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveTextContent("Profil");

    const homeLink = screen.getByLabelText("tasks-text");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent("Zadaci");

    const addBtn = screen.getByLabelText("addNewTaskBtn");
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent("Dodaj zadatak");
  });

  it("Should navigate to the profile page", () => {
    renderWithRouter(["/home"]);

    const profileLink = screen.getByLabelText("Profile");
    expect(profileLink).toBeInTheDocument();

    fireEvent.click(profileLink);

    expect(window.location.pathname === "/profile");
  });

  it("Should navigate to the profile page then to home page", () => {
    renderWithRouter(["/home"]);

    const profileLink = screen.getByLabelText("Profile");
    expect(profileLink).toBeInTheDocument();

    fireEvent.click(profileLink);

    expect(window.location.pathname === "/profile");

    const homeLink = screen.getByLabelText("Tasks");
    expect(homeLink).toBeInTheDocument();

    fireEvent.click(homeLink);

    expect(window.location.pathname === "/home");
  });

  it("Should navigate to the add new task page", () => {
    renderWithRouter(["/home"]);

    const newTaskBtn = screen.getByLabelText("addNewTaskBtn");
    expect(newTaskBtn).toBeInTheDocument();

    fireEvent.click(newTaskBtn);

    expect(window.location.pathname === "/add-task");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
