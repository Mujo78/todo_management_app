import { addDays } from "date-fns";

describe("Delete Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);

    cy.contains("Task To Be Deleted...").click();
    cy.wait(1500);
  });

  it("Should display form with data and delete button option", () => {
    cy.get('input[name="title"]')
      .should("be.visible")
      .should("have.value", "Task To Be Deleted");
    cy.get("#select-status")
      .should("have.attr", "aria-disabled", "true")
      .should("have.text", "Open");

    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible");
  });

  it("Should open task delete modal, show text and close it", () => {
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible").click();

    cy.contains(
      "Are you sure you want to delete your task: Task To Be Deleted?"
    ).should("be.visible");

    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]').should(
      "be.visible"
    );
    cy.get('button[aria-label="CloseDeleteTaskModalBtn"]')
      .should("be.visible")
      .click();

    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]').should(
      "not.exist"
    );
  });

  it("Should successfully delete task", () => {
    cy.get('button[aria-label="DeleteTaskBtn"]').should("be.visible").click();
    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]').click();

    cy.wait(1500);
    cy.location("pathname").should("eq", "/home");
  });

  after(() => {
    cy.getAllLocalStorage().then((localStorage) => {
      const token = localStorage["http://localhost:5173"].auth;
      if (token) {
        const options = {
          method: "POST",
          url: "https://localhost:7196/api/v1/assignments",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            title: "Task To Be Deleted",
            description: "",
            dueDate: addDays(new Date(), 2).toISOString(),
            priority: 2,
            status: 0,
          },
        };
        cy.request(options);
      }
    });
  });
});
