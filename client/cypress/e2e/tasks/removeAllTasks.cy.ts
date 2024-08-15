describe("Delete All Tasks functionality testing", () => {
  it("Should display button for deleting when there is at least one task available", () => {
    cy.login();
    cy.wait(1500);

    cy.get('span[aria-label="Label-Fourth Task Created-task"]').should(
      "be.visible"
    );
    cy.get('button[aria-label="RemoveAllTasks"]').should("be.visible");
  });

  it("Should not display button when there are no tasks available", () => {
    cy.login("user-testing-third@example.com");
    cy.wait(1500);

    cy.get('button[aria-label="RemoveAllTasks"]').should("not.exist");
    cy.contains("No data available.").should("be.visible");
  });

  it("Should successfully delete all tasks available", () => {
    cy.login();
    cy.wait(1500);

    cy.get('button[aria-label="RemoveAllTasks"]').should("be.visible").click();

    cy.wait(2000);
    cy.contains("No data available.").should("be.visible");
    cy.contains("Tasks successfully deleted.").should("be.visible");
  });

  after(() => {
    cy.request("POST", "https://localhost:7196/seed-database-assignments");
    cy.reload();
  });
});
