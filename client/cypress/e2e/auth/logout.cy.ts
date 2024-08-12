describe("Logout functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
  });

  it("Should show logout button", () => {
    cy.openMenu();

    cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible");
  });

  it("Should return error message when user not authorized to logout (tokens not provided)", () => {
    cy.openMenu();

    cy.clearAllCookies();

    cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible").click();
    cy.contains("Invalid token provided.").should("be.visible");
  });

  it("Should successfully logout", () => {
    cy.openMenu();
    cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/");
  });
});
