import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Profile Layout component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should render", async () => {
    renderWithRouter(["/profile"]);
    const expectedTitle = screen.getByText("Overview", { selector: "h5" });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should display navigation links on english language", async () => {
    renderWithRouter(["/profile"]);
    const overviewLink = screen.getAllByLabelText("link-/profile");
    expect(overviewLink[0]).toBeInTheDocument();
    expect(overviewLink[0]).toHaveTextContent("Overview");

    const editProfileLink = screen.getAllByLabelText("link-/profile/edit");
    expect(editProfileLink[0]).toBeInTheDocument();
    expect(editProfileLink[0]).toHaveTextContent("Edit");

    const changePasswordLink = screen.getAllByLabelText(
      "link-/profile/change-password"
    );
    expect(changePasswordLink[0]).toBeInTheDocument();
    expect(changePasswordLink[0]).toHaveTextContent("Change Password");
  });

  it("Should display navigation links on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile"]);

    const overviewLink = screen.getAllByLabelText("link-/profile");
    expect(overviewLink[0]).toBeInTheDocument();
    expect(overviewLink[0]).toHaveTextContent("Pregled");

    const editProfileLink = screen.getAllByLabelText("link-/profile/edit");
    expect(editProfileLink[0]).toBeInTheDocument();
    expect(editProfileLink[0]).toHaveTextContent("Uredi");

    const changePasswordLink = screen.getAllByLabelText(
      "link-/profile/change-password"
    );
    expect(changePasswordLink[0]).toBeInTheDocument();
    expect(changePasswordLink[0]).toHaveTextContent("Promjena lozinke");

    const overviewTitle = screen.getByText("Pregled profila");
    expect(overviewTitle).toBeInTheDocument();
    expect(overviewTitle).toBeVisible();
  });

  it("Should navigate to the Edit Profile page", () => {
    renderWithRouter(["/profile"]);
    const linkTo = screen.getByLabelText("link-/profile/edit");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Edit Profile", { selector: "h5" });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should navigate to the Edit Profile page - bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile"]);

    const linkTo = screen.getByLabelText("link-/profile/edit");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Uređivanje profila", {
      selector: "h5",
    });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should navigate to the Change Password page", () => {
    renderWithRouter(["/profile"]);
    const linkTo = screen.getByLabelText("link-/profile/change-password");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Change Password", {
      selector: "h5",
    });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should navigate to the Change Password page - bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/profile"]);

    const linkTo = screen.getByLabelText("link-/profile/change-password");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Promjena lozinke", {
      selector: "h5",
    });
    expect(expectedTitle).toBeInTheDocument();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
