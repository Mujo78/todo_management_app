import { addDays, format, subDays } from "date-fns";

const date = addDays(new Date(), 2);
const dateToUse = format(date, "MM/dd/yyyy hh:mm PM");

describe("Add Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/add-task");
  });

  it("Should show add task form", () => {
    cy.get('input[name="title"]').should("be.visible");
    cy.get('textarea[name="description"]').should("be.visible");

    cy.contains("Add a new Task").should("be.visible");
    cy.get('button[aria-label="BackButton"]').should("be.visible");
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

    cy.contains(
      "Assignment with title: 'First Task Created' already exists."
    ).should("be.visible");
  });

  it("Should create new task successfully", () => {
    cy.addTask({
      dueDate: dateToUse,
      priority: 2,
      title: `Task Number-${Date.now()}`,
      description: "Description goes here!",
    });

    cy.contains("Successfully created a new task.").should("be.visible");
  });
});
