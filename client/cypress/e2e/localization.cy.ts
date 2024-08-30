describe("Localization functionality testing", () => {
  it("Should display change language icon btn on login page", () => {
    cy.visit("/");

    cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
  });

  it("Should display change language icon btn on signup page", () => {
    cy.visit("/signup");

    cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
  });

  it("Should display change language icon btn on forgotPassword page", () => {
    cy.visit("/forgot-password");

    cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
  });

  it("Should display change language icon btn on resetPassword page", () => {
    cy.visit("/password-reset/:tokenId");

    cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
  });

  it("Should display change language icon btn on verifyEmail page", () => {
    cy.visit("/verify/:tokenId");

    cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
  });

  it("Should change language on login page to bosnian", () => {
    cy.visit("/");

    cy.changeLng("bs");

    cy.contains("Prijavite se na Vaš račun").should("be.visible");
  });

  it("Should change language on login page to english from bosnian", () => {
    cy.visit("/");
    cy.changeLng("bs");

    cy.contains("Prijavite se na Vaš račun").should("be.visible");

    cy.get(`li[aria-label="EnglishLngItem"`).should("be.visible").click();
    cy.contains("Log in to Your Account").should("be.visible");
  });
});
