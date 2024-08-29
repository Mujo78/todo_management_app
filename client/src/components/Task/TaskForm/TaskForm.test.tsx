import { describe } from "vitest";
import useAuthStore from "../../../app/authSlice";
import { mockStore } from "../../../msw/Worker";
import {
  changeLng,
  renderWithRouter,
} from "../../../helpers/tests/HelperTestsFunctions";
import { screen, waitFor } from "@testing-library/react";

vi.mock("../../../app/authSlice.ts", () => ({
  default: vi.fn(),
}));

describe("TaskForm component testing - language", () => {
  beforeEach(async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockStore);
    await changeLng("eng");
  });

  it("Should display form on english language", async () => {
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const titleLabel = screen.getByLabelText("Title").querySelector("label");

      expect(titleLabel).toBeInTheDocument();
      expect(titleLabel).toBeVisible();
      expect(titleLabel).toHaveTextContent("Title");

      const dueDateLabel = screen.getByLabelText("Due Date and Time");

      expect(dueDateLabel).toBeInTheDocument();
      expect(dueDateLabel).toBeVisible();

      const descriptionLabel = screen
        .getAllByLabelText("Description")[1]
        .querySelector("label");

      expect(descriptionLabel).toBeInTheDocument();
      expect(descriptionLabel).toBeVisible();
      expect(descriptionLabel).toHaveTextContent("Description");

      const priorityLabel = screen.getByLabelText("Priority");

      expect(priorityLabel).toBeInTheDocument();
      expect(priorityLabel).toBeVisible();

      const statusLabel = screen.getByLabelText("Status");

      expect(statusLabel).toBeInTheDocument();
      expect(statusLabel).toBeVisible();

      const deleteBtn = screen.getByLabelText("DeleteTaskBtn");

      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toBeVisible();
      expect(deleteBtn).toHaveTextContent("Delete Task");

      const saveBtn = screen.getByRole("button", { name: /Save/ });

      expect(saveBtn).toBeInTheDocument();
      expect(saveBtn).toBeVisible();
      expect(saveBtn).toHaveTextContent("Save");
    });
  });

  it("Should display form on bosnian language", async () => {
    await changeLng("bs");
    renderWithRouter(["/edit-task/:taskId"]);

    await waitFor(() => {
      const titleLabel = screen.getByLabelText("Title").querySelector("label");

      expect(titleLabel).toBeInTheDocument();
      expect(titleLabel).toBeVisible();
      expect(titleLabel).toHaveTextContent("Naziv");

      const dueDateLabel = screen.getByLabelText("Rok (datum i vrijeme)");

      expect(dueDateLabel).toBeInTheDocument();
      expect(dueDateLabel).toBeVisible();

      const descriptionLabel = screen
        .getByLabelText("Description")
        .querySelector("label");

      expect(descriptionLabel).toBeInTheDocument();
      expect(descriptionLabel).toBeVisible();
      expect(descriptionLabel).toHaveTextContent("Opis");

      const priorityLabel = screen.getByText("Prioritet");

      expect(priorityLabel).toBeInTheDocument();
      expect(priorityLabel).toBeVisible();

      const statusLabel = screen.getByLabelText("Status");

      expect(statusLabel).toBeInTheDocument();
      expect(statusLabel).toBeVisible();

      const deleteBtn = screen.getByLabelText("DeleteTaskBtn");

      expect(deleteBtn).toBeInTheDocument();
      expect(deleteBtn).toBeVisible();
      expect(deleteBtn).toHaveTextContent("Izbriši zadatak");

      const saveBtn = screen.getByRole("button", { name: /Spremi/ });

      expect(saveBtn).toBeInTheDocument();
      expect(saveBtn).toBeVisible();
      expect(saveBtn).toHaveTextContent("Spremi");
    });
  });
});
