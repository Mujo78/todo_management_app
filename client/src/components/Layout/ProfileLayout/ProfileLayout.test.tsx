import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Profile Layout component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    renderWithRouter(["/profile"]);
  });

  it("Should render", async () => {
    const expectedTitle = screen.getByText("Overview", { selector: "h5" });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should navigate to the Edit Profile page", () => {
    const linkTo = screen.getByLabelText("link-/profile/edit");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Edit Profile", { selector: "h5" });
    expect(expectedTitle).toBeInTheDocument();
  });

  it("Should navigate to the Change Password page", () => {
    const linkTo = screen.getByLabelText("link-/profile/change-password");
    expect(linkTo).toBeInTheDocument();

    fireEvent.click(linkTo);

    const expectedTitle = screen.getByText("Change Password", {
      selector: "h5",
    });
    expect(expectedTitle).toBeInTheDocument();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
