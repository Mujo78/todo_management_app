describe("Login functionality testing", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("LoginPage should be visible with form and info element", () => {
    cy.contains("Log in to Your Account").should("be.visible");
    cy.contains("Welcome to TaskMaster").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("Should navigate to the SignupPage successfully", () => {
    cy.get('a[aria-label="signup"]').click();

    cy.contains("Sign up today!").should("be.visible");
  });

  it("Should navigate to the ForgotPasswordPage successfully", () => {
    cy.get('a[aria-label="forgotPassword"]').click();

    cy.contains("Forgot Your Password?").should("be.visible");
  });

  it("Should return message when account is not found", () => {
    cy.get('input[name="email"]').should("be.visible").type("user@example.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Password&123456");
    cy.get('button[type="submit"]').click();

    cy.contains("Account doesn't exists.");
  });

  it("Should return incorrect email or password", () => {
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("user-testing@example.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Password&1234567890");
    cy.get('button[type="submit"]').click();

    cy.contains("Incorrect email or password.").should("be.visible");
  });

  it("Should successfully log in", () => {
    cy.login();

    cy.wait(2000);
    cy.getCookie("refreshToken").should("exist");
  });
});
