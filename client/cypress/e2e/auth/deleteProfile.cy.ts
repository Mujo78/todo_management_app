describe("Delete Profile functionality testing", () => {
  beforeEach(() => {
    cy.login("user-testing-to-delete@example.com");
    cy.wait(1500);
    cy.visit("/profile");
  });

  it("Should show delete profile option", () => {
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .click();

    cy.contains("Are you sure you want to delete your profile?").should(
      "be.visible"
    );
    cy.get('button[aria-label="closeDeleteProfileModalbtn"]').should(
      "be.visible"
    );
    cy.get('button[aria-label="confirmDeleteProfilebtn"]').should("be.visible");
  });

  it("Should successfully delete profile", () => {
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .click();

    cy.get('button[aria-label="confirmDeleteProfilebtn"]')
      .should("be.visible")
      .click();

    cy.wait(1500);
    cy.location("pathname").should("eq", "/");
    cy.login("user-testing-to-delete@example.com");

    cy.contains("Account doesn't exists.").should("be.visible");
  });
});
