import { addDays } from "date-fns";

describe("Remove Selected Tasks functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.chooseTaskToAction("Fourth Task Created");
  });

  it("Should choose one task and dispplay header option for removing choosen tasks", () => {
    cy.get('span[aria-label="Label-Fourth Task Created-task"]')
      .find('input[type="checkbox"]')
      .should("be.checked");

    cy.get('button[aria-label="RemoveSelectedTasks"]').should("be.visible");
  });

  it("Should successfully delete selected tasks", () => {
    cy.get('button[aria-label="RemoveSelectedTasks"]')
      .should("be.visible")
      .click();
    cy.wait(1500);

    cy.contains("Tasks successfully deleted.").should("be.visible");
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
            title: "Fourth Task Created",
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
