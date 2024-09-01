import { addDays, format, subDays } from "date-fns";

const date = addDays(new Date(), 2);
const dateToUse = format(date, "MM/dd/yyyy hh:mm PM");

describe("Add Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/add-task");
  });

  it("Should show add task form - english", () => {
    cy.contains("Add a new Task").should("be.visible");

    cy.get('input[name="title"]').should("be.visible").should("have.value", "");
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

    cy.get("#select-priority").should("be.visible").should("have.text", "Low");
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
  });

  it("Should show add task form - bosnian", () => {
    cy.changeLngDropdown("bs");
    cy.get("body").click();
    cy.wait(1000);
    cy.get("body").click();

    cy.contains("Dodaj novi zadatak").should("be.visible");

    cy.get('input[name="title"]').should("be.visible").should("have.value", "");
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
      .should("have.text", "Nisko");
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
  });

  it("Should navigate back to the home page", () => {
    cy.get('button[aria-label="BackButton"]').should("be.visible").click();
    cy.location("pathname").should("eq", "/home");
  });

  it("Should show form valdiation error messages", () => {
    const date = subDays(new Date(), 2);
    const dateToUseOnlyHere = format(date, "MM/dd/yyyy hh:mm PM");

    cy.addTask({
      dueDate: dateToUseOnlyHere,
      priority: 2,
      title: "Hello",
      description: "Description is not required.",
    });

    cy.contains("Title must be at least 10 characters long.").should(
      "be.visible"
    );
    cy.contains("Date can not be in the past!").should("be.visible");
  });

  it("Should return error message if task already created", () => {
    cy.addTask({
      dueDate: dateToUse,
      priority: 2,
      title: "First Task Created",
      description: "Description goes here!",
    });

    cy.contains("Assignment with this title already exists.").should(
      "be.visible"
    );
  });

  it("Should create new task successfully", () => {
    cy.addTask({
      dueDate: dateToUse,
      priority: 2,
      title: `Task Number One For Testing`,
      description: "Description goes here!",
    });

    cy.contains("Successfully created a new task.").should("be.visible");
  });

  after(() => {
    cy.request(
      "DELETE",
      "https://localhost:7196/database-assignments-delete-added"
    );
    cy.reload();
  });
});
