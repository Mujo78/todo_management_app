describe("Logout functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
  });

  it("Should display logout button - english language", () => {
    cy.openMenu();

    cy.get('li[aria-label="LogoutBtnLink"]')
      .should("be.visible")
      .should("have.text", "Log out");
  });

  it("Should display logout button - bosnian language", () => {
    cy.openMenu();
    cy.changeLng("bs");

    cy.get("body").click();

    cy.get('li[aria-label="LogoutBtnLink"]')
      .should("be.visible")
      .should("have.text", "Odjava");
  });

  it("Should successfully logout", () => {
    cy.openMenu();
    cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/");
  });
});
