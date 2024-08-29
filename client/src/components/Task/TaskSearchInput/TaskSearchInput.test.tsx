import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen } from "@testing-library/react";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("TaskSearchInput component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should dispaly input and label on english language", () => {
    renderWithRouter(["/home"]);

    const searchInput = screen
      .getAllByLabelText("Search")[1]
      .querySelector("input");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();

    const searchLabel = screen
      .getAllByLabelText("Search")[1]
      .querySelector("label");
    expect(searchLabel).toBeInTheDocument();
    expect(searchLabel).toBeVisible();
    expect(searchLabel).toHaveTextContent("Search");
  });

  it("Should dispaly input and label on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/home"]);

    const searchInput = screen.getByLabelText("Search").querySelector("input");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();

    const searchLabel = screen.getByLabelText("Search").querySelector("label");
    expect(searchLabel).toBeInTheDocument();
    expect(searchLabel).toBeVisible();
    expect(searchLabel).toHaveTextContent("Pretraži");
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
