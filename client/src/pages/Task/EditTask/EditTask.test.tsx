import { describe, expect } from "vitest";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import useAuthStore from "../../../app/authSlice";
import { mockStore, serviceWorker } from "../../../msw/Worker";
import { notFoundTaskHandler } from "../../../msw/taskHandlers";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseCheckForGetMethodOnFormFields = async () => {
  renderWithRouter(["/edit-task/:taskId"]);

  await waitFor(() => {
    const pageTitle = screen.getByText("Edit task", { selector: "h5" });
    const titleEl = screen.getByLabelText("Title").querySelector("input")!;
    const descriptionEl = screen.getAllByLabelText("Description")![0];

    const priorityEl = screen
      .getByLabelText("Priority")
      .querySelector("input")!;
    const statusEl = screen
      .getAllByLabelText("Status")[1]
      .querySelector("input")!;
    const submitBtn = screen.getByRole("button", { name: "Save" });

    expect(titleEl).toHaveValue("Test Assignment Four");
    expect(descriptionEl).toHaveValue("Description");
    expect(priorityEl).toHaveValue("2");
    expect(statusEl).toHaveValue("0");
    expect(pageTitle).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });
};

describe("Edit Task component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", async () => {
    await baseCheckForGetMethodOnFormFields();
  });

  it("Should display Assignment not found", async () => {
    serviceWorker.use(notFoundTaskHandler);
    renderWithRouter(["/edit-task/:taskId"]);

    setTimeout(async () => {
      expect(
        await screen.findByText("Assignment not found.")
      ).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
