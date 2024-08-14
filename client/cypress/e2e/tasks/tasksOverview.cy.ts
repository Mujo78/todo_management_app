describe("template spec", () => {
  it("Should return no data available.", () => {
    cy.login("user-testing-third@example.com");
    cy.wait(1500);

    cy.contains("No data available.").should("be.visible");
  });

  it("Should show few tasks on home page, search input and pagination", () => {
    cy.login();
    cy.wait(1500);

    cy.get('input[name="taskName"]').should("be.visible");
    cy.get('button[aria-label="AddNewTask"]').should("be.visible");

    cy.contains("First Task Created").should("be.visible");

    cy.get('nav[aria-label="pagination navigation"]').should("be.visible");
  });

  it("Should navigate to the add-task page", () => {
    cy.login();
    cy.wait(1500);

    cy.get('button[aria-label="AddNewTask"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/add-task");
  });

  it("Should display header options", () => {
    cy.login();
    cy.wait(1500);

    cy.get('span[aria-label="Label-First Task Created-task"]')
      .find('input[type="checkbox"]')
      .click();

    cy.wait(1000);

    cy.get('button[aria-label="MakeTasksFinished"]').should("be.visible");
    cy.get('button[aria-label="RemoveSelectedTasks"]').should("be.visible");
    cy.get('button[aria-label="RemoveAllTasks"]').should("be.visible");
  });

  it("Should display pagination and navigate to the second page", () => {
    cy.login();
    cy.wait(1500);

    cy.get('nav[aria-label="pagination navigation"]').should("be.visible");
    cy.get('button[aria-label="Go to page 2"]').should("be.visible").click();

    cy.wait(1000);
    cy.location("pathname").should("eq", "/home");
    cy.location("search").should("eq", "?pageNum=2");
  });

  it("Should search for a task - return no data available, and then clear/return to all tasks", () => {
    cy.login();
    cy.wait(1500);

    cy.get('input[name="taskName"]')
      .should("be.visible")
      .type("Find me task now")
      .type("{enter}");

    cy.wait(1500);

    cy.contains("No data available.").should("be.visible");
    cy.get('button[aria-label="ClearSearchBtn"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/home");
    cy.location("search").should("eq", "?pageNum=1");
  });

  it("Should successfully find a task, and navigate to it (edit page)", () => {
    cy.login();
    cy.wait(1500);

    cy.get('input[name="taskName"]')
      .should("be.visible")
      .type("First Task Created")
      .type("{enter}");

    cy.wait(1500);

    cy.contains("First Task Created...").click();
    cy.wait(1500);

    cy.location("pathname").should(
      "eq",
      "/edit-task/c4b62272-2cdb-436b-a1b3-d770e6f11b44"
    );
  });
});
