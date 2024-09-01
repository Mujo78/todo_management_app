import { addDays, format, subDays } from "date-fns";

describe("Edit Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/edit-task/c4b62272-2cdb-436b-a1b3-d770e6f11b44");
    cy.wait(1500);
  });

  it("Should show form filled with fetched data - english", () => {
    cy.contains("Edit task").should("be.visible");

    cy.get('input[name="title"]')
      .should("be.visible")
      .should("have.value", "First Task Created");
    cy.get('div[aria-label="Title"]')
      .should("be.visible")
      .find("label")
      .should("be.visible")
      .should("have.text", "Title *");

    cy.get('input[name="dueDate"]').should("be.visible");
    cy.contains("Due Date and Time").should("be.visible");

    cy.get('textarea[name="description"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('div[aria-label="Description"]')
      .should("be.visible")
      .find("label")
      .should("be.visible")
      .should("have.text", "Description");

    cy.get("#select-priority").should("be.visible").should("have.text", "High");
    cy.get("#select-priority-label")
      .should("be.visible")
      .should("have.text", "Priority *");

    cy.get("#select-status").should("be.visible").should("have.text", "Open");
    cy.get("#select-status-label")
      .should("be.visible")
      .should("have.text", "Status *");

    cy.get('button[aria-label="BackButton"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Save");
    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Delete Task");
  });

  it("Should show form filled with fetched data - bosnian", () => {
    cy.changeLngDropdown("bs");
    cy.get("body").click();
    cy.wait(1000);
    cy.get("body").click();

    cy.contains("Uređivanje zadatka").should("be.visible");

    cy.get('input[name="title"]')
      .should("be.visible")
      .should("have.value", "First Task Created");
    cy.get('div[aria-label="Title"]')
      .should("be.visible")
      .find("label")
      .should("be.visible")
      .should("have.text", "Naziv *");

    cy.get('input[name="dueDate"]').should("be.visible");
    cy.contains("Rok (datum i vrijeme)").should("be.visible");

    cy.get('textarea[name="description"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('div[aria-label="Description"]')
      .should("be.visible")
      .find("label")
      .should("be.visible")
      .should("have.text", "Opis");

    cy.get("#select-priority")
      .should("be.visible")
      .should("have.text", "Visoko");
    cy.get("#select-priority-label")
      .should("be.visible")
      .should("have.text", "Prioritet *");

    cy.get("#select-status")
      .should("be.visible")
      .should("have.text", "Otvoren");
    cy.get("#select-status-label")
      .should("be.visible")
      .should("have.text", "Status *");

    cy.get('button[aria-label="BackButton"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Spremi");
    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Izbriši zadatak");
  });

  it("Should show message when task is not found", () => {
    cy.visit("/edit-task/c4b62272-2cdb-436b-a1b3-d770e6f11b43");
    cy.wait(1500);

    cy.contains("Assignment not found.").should("be.visible");
  });

  it("Should navigate back to the home page", () => {
    cy.get('button[aria-label="BackButton"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/home");
  });

  it("Should show form validation errors", () => {
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

  it("Should show delete task modal and close it", () => {
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

    cy.contains("Assignment with this title already exists.").should(
      "be.visible"
    );
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

  it("Should disable form if task is completed, with possibility of deleting task", () => {
    cy.visit("/edit-task/27884557-1ed9-4429-abb5-d2588e5d4e59");
    cy.wait(1500);

    cy.get('input[name="title"]').should("be.visible").and("be.disabled");
    cy.get('input[name="dueDate"]').should("be.visible").and("be.disabled");
    cy.get('textarea[name="description"]')
      .should("be.visible")
      .and("be.disabled");

    cy.get("#select-priority").should("have.attr", "aria-disabled", "true");
    cy.get("#select-status").should("have.attr", "aria-disabled", "true");
    cy.get('button[type="submit"]').should("not.exist");
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible");
  });

  it("Should disable all form fields except dueDate if task is failed", () => {
    cy.visit("/edit-task/876e65d2-eb5c-4ab7-ad46-fe9c4a8884f7");
    cy.wait(1500);

    cy.get('input[name="title"]').should("be.visible").and("be.disabled");
    cy.get('input[name="dueDate"]').should("be.visible").and("not.be.disabled");
    cy.get('textarea[name="description"]')
      .should("be.visible")
      .and("be.disabled");

    cy.get("#select-priority").should("have.attr", "aria-disabled", "true");
    cy.get("#select-status").should("have.attr", "aria-disabled", "true");
    cy.get('button[type="submit"]').should("be.visible");
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible");
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
