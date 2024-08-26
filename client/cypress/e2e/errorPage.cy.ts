describe("Error Page functionality testing", () => {
  it("Should return not found page", () => {
    cy.visit("/home-page-dont-exist");

    cy.contains("404");
    cy.contains("Page not found");

    cy.get('a[href="/"]').should("be.visible");
    cy.contains("Contact Us").should("be.visible");
  });

  it("Should return on login page when user is not auth", () => {
    cy.visit("/home-page-dont-exist");
    cy.get('a[href="/"]').should("be.visible").click();

    cy.contains("Log in to Your Account").should("be.visible");
    cy.location("pathname").should("eq", "/");
  });

  it("Should return to home page when user is auth", () => {
    cy.login();
    cy.wait(1500);

    cy.visit("/home-page-dont-exist");
    cy.get('a[href="/"]').should("be.visible").click();

    cy.get('input[name="taskName"]').should("be.visible");
    cy.location("pathname").should("eq", "/home");
  });
});
