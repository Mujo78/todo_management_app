describe("Error Page functionality testing", () => {
  it("Should return not found page and display text on english language", () => {
    cy.visit("/home-page-dont-exist");

    cy.contains("404").should("be.visible");
    cy.contains("Page not found").should("be.visible");
    cy.contains("Sorry, we couldn't find the page you're looking for.").should(
      "be.visible"
    );

    cy.get('a[href="/"]').should("be.visible").should("have.text", "Home");
    cy.contains("Contact Us").should("be.visible");
  });

  it("Should return not found page and display text on bosnian language", () => {
    cy.visit("/home-page-dont-exist");
    cy.changeLng("bs");

    cy.contains("404").should("be.visible");
    cy.contains("Stranica nije pronađena").should("be.visible");
    cy.contains(
      "Žao nam je, nismo mogli pronaći stranicu koju tražite."
    ).should("be.visible");

    cy.get('a[href="/"]').should("be.visible").should("have.text", "Početna");
    cy.contains("Kontaktirajte nas").should("be.visible");
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
