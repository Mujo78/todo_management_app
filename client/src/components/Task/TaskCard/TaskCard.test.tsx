import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("TaskCard component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render with props", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const cardOne = screen.getByTestId("openTask-card");
      expect(cardOne).toBeInTheDocument();

      const cardCheckbox = cardOne.querySelector("input")!;
      expect(cardCheckbox).toBeInTheDocument();

      const cardTitle = screen.getByText("Open Task Here...");
      expect(cardTitle).toBeInTheDocument();
    });
  });

  it("Should navigate on edit page on click", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const cardOne = screen.getByTestId("openTask-card");
      expect(cardOne).toBeInTheDocument();

      fireEvent.click(cardOne);

      expect(window.location.pathname === "/edit-task/openTask");
    });
  });

  it("Should be selected with checkbox", async () => {
    renderWithRouter(["/home"]);

    await waitFor(() => {
      const cardOne = screen.getByTestId("openTask-card");
      expect(cardOne).toBeInTheDocument();

      const cardCheckbox = cardOne.querySelector("input")!;
      expect(cardCheckbox).toBeInTheDocument();

      fireEvent.click(cardCheckbox);

      expect(cardCheckbox.checked).toEqual(true);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
