import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen } from "@testing-library/react";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("TaskSearchInput component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", () => {
    renderWithRouter(["/home"]);

    const searchInput = screen
      .getAllByLabelText("Search")[1]
      .querySelector("input");
    expect(searchInput).toBeInTheDocument();
  });

  it("Should change value", () => {
    renderWithRouter(["/home"]);

    const searchInput = screen
      .getAllByLabelText("Search")[1]
      .querySelector("input")!;
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Search here" } });

    expect(searchInput).toHaveValue("Search here");
  });

  it("Should search for some task", () => {
    renderWithRouter(["/home"]);

    const searchInput = screen
      .getAllByLabelText("Search")[1]
      .querySelector("input")!;
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Search here" } });

    expect(searchInput).toHaveValue("Search here");
    expect(window.location.pathname === "/home?pageNum=1&name=Search+here");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
