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

  it("Should successfully log in", () => {
    cy.login();

    cy.contains("User Testing One").should("be.visible");
  });
});
