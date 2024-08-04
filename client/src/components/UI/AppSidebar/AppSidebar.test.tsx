import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("AppSidebar component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", () => {
    renderWithRouter(["/home"]);

    const userName = screen.getByText("User Test One");
    expect(userName).toBeInTheDocument();
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
