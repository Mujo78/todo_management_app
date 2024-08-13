import { addDays, format, subDays } from "date-fns";

describe("Edit Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/edit-task/c4b62272-2cdb-436b-a1b3-d770e6f11b44");
    cy.wait(1500);
  });

  it.skip("Should show form filled with fetched data", () => {
    cy.contains("Edit task").should("be.visible");
    cy.get('button[aria-label="BackButton"]').should("be.visible");
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible");
  });

  it.skip("Should show message when task is not found", () => {
    cy.visit("/edit-task/c4b62272-2cdb-436b-a1b3-d770e6f11b43");
    cy.wait(1500);

    cy.contains("Assignment not found.").should("be.visible");
  });

  it.skip("Should navigate back to the home page", () => {
    cy.get('button[aria-label="BackButton"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/home");
  });

  it.skip("Should show form validation errors", () => {
    const date = subDays(new Date(), 2);
    const dateToUseOnlyHere = format(date, "MM/dd/yyyy hh:mm PM");

    cy.editTask({
      title: "Hello",
      dueDate: dateToUseOnlyHere,
      priority: 2,
      description: "Description for task",
    });

    cy.contains("Title must be at least 10 characters long.").should(
      "be.visible"
    );
    cy.contains("Date can not be in the past!").should("be.visible");
  });

  it.skip("Should show delete task modal and close it", () => {
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible").click();

    cy.contains(
      "Are you sure you want to delete your task: First Task Created?"
    ).should("be.visible");
    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]').should(
      "be.visible"
    );
    cy.get('button[aria-label="CloseDeleteTaskModalBtn"]')
      .should("be.visible")
      .click();
  });

  it("Should return if task with same name already exist", () => {
    const date = addDays(new Date(), 2);
    const dateToUseOnlyHere = format(date, "MM/dd/yyyy hh:mm PM");

    cy.editTask({
      title: "Second Task Created",
      dueDate: dateToUseOnlyHere,
      priority: 1,
      description: "Description for second task",
    });

    cy.contains(
      "Assignment with title: 'Second Task Created' already exists."
    ).should("be.visible");
  });

  it("Should successfully update task name, description and priority", () => {
    const date = addDays(new Date(), 2);
    const dateToUseOnlyHere = format(date, "MM/dd/yyyy hh:mm PM");

    cy.editTask({
      title: "First Task Created Updated Name",
      dueDate: dateToUseOnlyHere,
      priority: 1,
      description: "Description for task",
    });

    cy.contains("Task successfully updated.").should("be.visible");
  });

  after(() => {
    cy.getAllLocalStorage().then((localStorage) => {
      const token = localStorage["http://localhost:5173"].auth;
      if (token) {
        const options = {
          method: "PUT",
          url: "https://localhost:7196/api/v1/assignments/c4b62272-2cdb-436b-a1b3-d770e6f11b44",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            id: "c4b62272-2cdb-436b-a1b3-d770e6f11b44",
            userId: "5979e203-2d8e-4b99-bde3-2881fefe96e4",
            title: "First Task Created",
            description: "",
            dueDate: addDays(new Date(), 2).toISOString(),
            priority: 2,
            status: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        cy.request(options);
      }
    });
  });
});
