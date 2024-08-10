describe("Reset Password functionality testing", () => {
  beforeEach(() => {
    cy.visit("/password-reset/5508116c-f287-4e54-8e9d-b556fdc9eeeb");
  });

  it("Should show reset password form and elements", () => {
    cy.contains("Reset Password").should("be.visible");
    cy.contains(
      "- Create a new password that you don't use on any other site,"
    ).should("be.visible");

    cy.get('input[name="newPassword"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("Should return error for password length", () => {
    cy.resetPassword("pass", "pass");

    cy.contains("Password must be at least 8 characters long.").should(
      "be.visible"
    );
  });

  it("Should return error about password weaknesses", () => {
    cy.resetPassword("Password", "Password");

    cy.contains(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ).should("be.visible");
  });

  it("Should return error about passwords match", () => {
    cy.resetPassword("Password&12345", "Password&123456");

    cy.contains("Passwords must match").should("be.visible");
  });

  it("Should not found token", () => {
    cy.visit("/password-reset/5508116c-f287-4e54-8e9d-b556fdc9eeebc");

    cy.resetPassword("Password&123456", "Password&123456");

    cy.contains("Invalid token provided. Token not found.").should(
      "be.visible"
    );
  });

  it("Should return old and new password matches", () => {
    cy.resetPassword("Password&123456", "Password&123456");
    cy.contains("New password cannot be the same as the old password.").should(
      "be.visible"
    );
  });

  it("Should successfully reset password", () => {
    cy.resetPassword("Password&12345", "Password&12345");
    cy.contains("Password successfully changed.").should("be.visible");
  });
});
