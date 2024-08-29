import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";
import { addDays, subDays } from "date-fns";
import { baseChangeTaskFormFn } from "../../../msw/taskHandlers";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("Add New Task component testing", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should display on english language", () => {
    renderWithRouter(["/add-task"]);

    const title = screen.getByText("Add a new Task", { selector: "h5" });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
  });

  it("Should display on english language", async () => {
    await changeLng("bs");
    renderWithRouter(["/add-task"]);

    const title = screen.getByText("Dodaj novi zadatak", { selector: "h5" });
    expect(title).toBeInTheDocument();
    expect(title).toBeVisible();
  });

  it.each([
    [
      "Title must be at least 10 characters long.",
      {
        title: "Title",
        dueDate: new Date(),
        status: 2,
        priority: 1,
        description: "None",
      },
    ],
    [
      "Due Date can not be in the past!",
      {
        title: "Title New Here Goes",
        dueDate: subDays(new Date(), 1),
        status: 2,
        priority: 1,
        description: "None",
      },
    ],
  ])("Should return message: `%s`", async (expectedMessage, value) => {
    renderWithRouter(["/add-task"]);
    await baseChangeTaskFormFn(value);

    await waitFor(async () => {
      const message = await screen.findByText(expectedMessage);
      expect(message).toBeInTheDocument();
    });
  });

  it("Should return already used title", async () => {
    renderWithRouter(["/add-task"]);
    await baseChangeTaskFormFn({
      title: "Already used title",
      dueDate: addDays(new Date(), 2),
      status: 2,
      priority: 1,
      description: "None",
    });

    setTimeout(async () => {
      expect(
        await screen.findByText(
          "Assignment with title: 'Already used title' already exists."
        )
      ).toBeInTheDocument();
    }, 2000);
  });

  it("Should be success", async () => {
    renderWithRouter(["/add-task"]);
    await baseChangeTaskFormFn({
      title: "New task creation here",
      dueDate: addDays(new Date(), 2),
      status: 2,
      priority: 1,
      description: "None",
    });

    setTimeout(async () => {
      expect(
        await screen.findByText("Successfully created a new task.")
      ).toBeInTheDocument();
    }, 2000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
