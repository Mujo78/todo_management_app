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

  it("Should display different names for languages in language switch menu - english", () => {
    cy.visit("/");
    cy.get('button[aria-label="LanguageBtn"]').should("be.visible").click();

    cy.get(`li[aria-label="EnglishLngItem"`)
      .should("be.visible")
      .should("have.text", "English");
    cy.get(`li[aria-label="BosnianLngItem"`)
      .should("be.visible")
      .should("have.text", "Bosnian");
  });

  it("Should display different names for languages in language switch menu - bosnian", () => {
    cy.visit("/");
    cy.changeLng("bs");

    cy.get(`li[aria-label="EnglishLngItem"`)
      .should("be.visible")
      .should("have.text", "Engleski");
    cy.get(`li[aria-label="BosnianLngItem"`)
      .should("be.visible")
      .should("have.text", "Bosanski");
  });

  it("Should use english as default langauge", () => {
    cy.visit("/");
    cy.changeLng("bs");
    cy.get("body").click();
    cy.clearLocalStorage("lng");
    cy.reload();
    cy.wait(1500);

    cy.contains("Log in to Your Account").should("be.visible");
    cy.contains("Prijavite se na Vaš račun").should("not.exist");
  });

  it("Should display language btn with label in appNavbar - english", () => {
    cy.login();
    cy.openMenu();

    cy.get('button[aria-label="LanguageBtn"]')
      .should("be.visible")
      .should("have.text", "Language");
  });

  it("Should display language btn with label in appNavbar - bosnian", () => {
    cy.login();
    cy.changeLngDropdown("bs");

    cy.get("body").click();

    cy.get('button[aria-label="LanguageBtn"]')
      .should("be.visible")
      .should("have.text", "Jezik");
  });
});
