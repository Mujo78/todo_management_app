describe("Forgot Password functionality testing", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("Should display forgot password form and info element on english language", () => {
    cy.contains("TaskMaster").should("be.visible");
    cy.contains("Forgot Password Instructions").should("be.visible");
    cy.contains(
      "Enter the email address associated with your account and we'll send you a link to reset your password."
    ).should("be.visible");

    cy.contains("Forgot Your Password?").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.get('button[aria-label="goBackBtn"]')
      .should("be.visible")
      .should("have.text", "Back to Log In page");
  });

  it("Should display forgot password form and info element on bosnian language", () => {
    cy.changeLng("bs");

    cy.contains("TaskMaster").should("be.visible");
    cy.contains("Uputstva").should("be.visible");
    cy.contains(
      "Unesite email adresu koja je povezana sa vašim računom i mi ćemo vam poslati link za resetovanje vaše lozinke."
    ).should("be.visible");

    cy.contains("Zaboravili ste lozinku?").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
    cy.get('button[aria-label="goBackBtn"]')
      .should("be.visible")
      .should("have.text", "Nazad na stranicu za prijavu");
  });

  it("Should toggle language on the page - from english to bosnian and reverse", () => {
    cy.changeLng("bs");
    cy.contains("Zaboravili ste lozinku?").should("be.visible");

    cy.get(`li[aria-label="EnglishLngItem"`).should("be.visible").click();
    cy.contains("Forgot Your Password?").should("be.visible");

    cy.get(`li[aria-label="BosnianLngItem"`).should("be.visible").click();
    cy.contains("Zaboravili ste lozinku?").should("be.visible");
  });

  it("Should successfully navigate to login page", () => {
    cy.get('button[aria-label="goBackBtn"]').should("be.visible").click();

    cy.contains("Log in to Your Account").should("be.visible");
  });

  it("Should return User not found, for accounts that dont exists", () => {
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("notFoundUserAccount@gmail.com");
    cy.get('button[type="submit"]').should("be.visible").click();

    cy.contains("User not found.").should("be.visible");
  });

  it("Should successfully send email link for reset password", () => {
    cy.forgotPassword();

    cy.contains(
      "Check your email inbox to proceed with restarting your password."
    ).should("be.visible");
  });

  it("Should return that email already sent for reset password", () => {
    cy.forgotPassword();
    cy.contains(
      "Reset password link already created. Please check your inbox."
    ).should("be.visible");
  });

  after(() => {
    cy.request("DELETE", "https://localhost:7196/reset-database");
  });
});
