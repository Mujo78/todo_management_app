import { addDays } from "date-fns";

describe("Delete Task functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);

    cy.contains("Task To Be Deleted...").click();
    cy.wait(1500);
  });

  it("Should display data and delete button option - english", () => {
    cy.get('input[name="title"]')
      .should("be.visible")
      .should("have.value", "Task To Be Deleted");

    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Delete Task");
  });

  it("Should display data and delete button option - bosnian", () => {
    cy.changeLngDropdown("bs");
    cy.get("body").click();
    cy.wait(100);
    cy.get("body").click();

    cy.get('input[name="title"]')
      .should("be.visible")
      .should("have.value", "Task To Be Deleted");

    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Izbriši zadatak");
  });

  it("Should open task delete modal, display text and close it - english", () => {
    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Delete Task")
      .click();

    cy.contains(
      "Are you sure you want to delete your task: Task To Be Deleted?"
    ).should("be.visible");

    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]')
      .should("be.visible")
      .should("have.text", "Confirm");
    cy.get('button[aria-label="CloseDeleteTaskModalBtn"]')
      .should("be.visible")
      .should("have.text", "Close")
      .click();

    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]').should(
      "not.exist"
    );
  });

  it("Should open task delete modal, display text and close it - bosnian", () => {
    cy.changeLngDropdown("bs");
    cy.get("body").click();
    cy.wait(1000);
    cy.get("body").click();

    cy.get('button[aria-label="DeleteTaskBtn"]')
      .should("be.visible")
      .should("have.text", "Izbriši zadatak")
      .click();

    cy.contains(
      "Jeste li sigurni da želite izbrisati zadatak: Task To Be Deleted?"
    ).should("be.visible");

    cy.get('button[aria-label="ConfirmDeleteTaskModalBtn"]')
      .should("be.visible")
      .should("have.text", "Potvrdi");
    cy.get('button[aria-label="CloseDeleteTaskModalBtn"]')
      .should("be.visible")
      .should("have.text", "Zatvori")
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

    cy.reload();
  });
});
