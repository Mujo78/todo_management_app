describe("Change Password functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/profile/change-password");
  });

  it("Should display form and title - english language", () => {
    cy.contains("Change Password").should("be.visible");

    cy.get("#Password-label")
      .should("be.visible")
      .should("have.text", "Password *");
    cy.get('input[name="oldPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get("#New\\ Password-label")
      .should("be.visible")
      .should("have.text", "New Password *");
    cy.get('input[name="newPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get("#Confirm\\ New\\ Password-label")
      .should("be.visible")
      .should("have.text", "Confirm New Password *");
    cy.get('input[name="confirmNewPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Save changes");
  });

  it("Should display form and title - english language", () => {
    cy.changeLngDropdown("bs");

    cy.contains("Promjena lozinke").should("be.visible");

    cy.get("#Lozinka-label")
      .should("be.visible")
      .should("have.text", "Lozinka *");
    cy.get('input[name="oldPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get("#Nova\\ Lozinka-label")
      .should("be.visible")
      .should("have.text", "Nova Lozinka *");
    cy.get('input[name="newPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get("#Potvrdi\\ Lozinku-label")
      .should("be.visible")
      .should("have.text", "Potvrdi Lozinku *");
    cy.get('input[name="confirmNewPassword"]')
      .should("be.visible")
      .should("have.value", "");

    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Spremi");
  });

  it("Should show form validation error message for new password", () => {
    cy.changePassword("Password&12345", "Hello", "Hello");

    cy.contains("Password must be at least 8 characters long.");
  });

  it("Should show form validation error messages", () => {
    cy.changePassword("Password&12345", "Password", "Hell");

    cy.contains(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ).should("be.visible");
    cy.contains("Confirm Password must match with new password.").should(
      "be.visible"
    );
  });

  it("Should return message when old password is wrong", () => {
    cy.changePassword(
      "Password&123456789",
      "Password&123456",
      "Password&123456"
    );

    cy.contains("Wrong old password.").should("be.visible");
  });

  it("Should return message when old password and new password are same", () => {
    cy.changePassword("Password&123456", "Password&123456", "Password&123456");

    cy.contains("New password cannot be the same as the old password.").should(
      "be.visible"
    );
  });

  it("Should successfully change password", () => {
    cy.changePassword("Password&123456", "Password&12345", "Password&12345");

    cy.contains("Password successfully changed.").should("be.visible");
  });

  after(() => {
    cy.getAllLocalStorage().then((localStorage) => {
      const token = localStorage["http://localhost:5173"].auth;
      if (token) {
        const options = {
          method: "POST",
          url: "https://localhost:7196/api/v1/users/change-password",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            oldPassword: "Password&12345",
            newPassword: "Password&123456",
            confirmNewPassword: "Password&123456",
          },
        };
        cy.request(options);
      }
    });
  });
});
