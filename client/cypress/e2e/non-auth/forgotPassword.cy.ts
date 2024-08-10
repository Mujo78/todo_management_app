describe("Forgot Password functionality testing", () => {
  beforeEach(() => {
    cy.visit("/forgot-password");
  });

  it("Should show forgot password form and info element", () => {
    cy.contains("TaskMaster").should("be.visible");
    cy.contains("Forgot Password Instructions").should("be.visible");
    cy.contains("Forgot Your Password?").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
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

    cy.contains("Please check your inbox for reset password link.").should(
      "be.visible"
    );
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
