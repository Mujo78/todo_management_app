import { addDays } from "date-fns";

describe("Make Tasks Finished functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.chooseTaskToAction();
  });

  it("Should choose one task and dispplay header option for making task finished", () => {
    cy.get('span[aria-label="Label-First Task Created-task"]')
      .find('input[type="checkbox"]')
      .should("be.checked");

    cy.get('button[aria-label="MakeTasksFinished"]').should("be.visible");
  });

  it("Should successfully make task finished", () => {
    cy.get('button[aria-label="MakeTasksFinished"]')
      .should("be.visible")
      .click();
    cy.wait(1500);

    cy.contains("Tasks successfully completed.").should("be.visible");
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

    cy.reload();
  });
});
