import { describe, expect } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import { renderWithRouter } from "../../../helpers/tests/HelperTestsFunctions";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { CreateUpdateTaskType } from "../../../app/taskSlice";
import { addDays, format, subDays } from "date-fns";
import { act } from "@testing-library/react";

vi.mock("../../../app//authSlice.ts", () => ({
  default: vi.fn(),
}));

const baseAddTaskFn = async ({
  title,
  dueDate,
  priority,
  status,
  description,
}: CreateUpdateTaskType) => {
  renderWithRouter(["/add-task"]);

  const formattedDate = format(new Date(), "MMM d, yyyy");

  const titleEl = screen.getByLabelText("Title").querySelector("input")!;
  const dueDateElInput = screen.getByLabelText(
    `Choose date, selected date is ${formattedDate}`
  )!;
  const descriptionEl = screen.getAllByLabelText("Description")![0];

  const priorityEl = screen.getByLabelText("Priority").querySelector("input")!;
  const statusEl = screen
    .getAllByLabelText("Status")[1]
    .querySelector("input")!;
  const submitBtn = screen.getByRole("button", { name: "Save" });

  expect(titleEl).toBeInTheDocument();
  expect(dueDateElInput).toBeInTheDocument();
  expect(descriptionEl).toBeInTheDocument();
  expect(priorityEl).toBeInTheDocument();
  expect(statusEl).toBeInTheDocument();
  expect(submitBtn).toBeInTheDocument();

  await act(async () => {
    fireEvent.change(titleEl, { target: { value: title } });
    fireEvent.change(dueDateElInput, { target: { value: dueDate } });
    fireEvent.change(descriptionEl, { target: { value: description } });
    fireEvent.change(priorityEl, { target: { value: priority } });
    fireEvent.change(statusEl, { target: { value: status } });

    fireEvent.click(submitBtn);
  });
};

describe("Add New Task component testing", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("Should render", () => {
    renderWithRouter(["/add-task"]);

    const title = screen.getByText("Add a new Task", { selector: "h5" });
    expect(title).toBeInTheDocument();
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
      "Date can not be in the past!",
      {
        title: "Title New Here Goes",
        dueDate: subDays(new Date(), 1),
        status: 2,
        priority: 1,
        description: "None",
      },
    ],
  ])("Should return message: `%s`", async (expectedMessage, value) => {
    await baseAddTaskFn(value);

    await waitFor(async () => {
      const message = await screen.findByText(expectedMessage);
      expect(message).toBeInTheDocument();
    });
  });

  it("Should return already used title", async () => {
    await baseAddTaskFn({
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
    await baseAddTaskFn({
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
