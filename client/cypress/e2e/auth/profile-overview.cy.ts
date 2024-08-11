describe("Profile Overview functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/profile");
  });

  it("Should navigate to the edit-profile page", () => {
    cy.get('a[aria-label="link-/profile/edit"]').should("be.visible").click();

    cy.location("pathname").should("eq", "/profile/edit");
    cy.contains("Edit Profile").should("be.visible");

    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
  });

  it("Should navigate to the change-password page", () => {
    cy.get('a[aria-label="link-/profile/change-password"]')
      .should("be.visible")
      .click();

    cy.location("pathname").should("eq", "/profile/change-password");
    cy.contains("Change Password").should("be.visible");

    cy.get('input[name="oldPassword"]').should("be.visible");
    cy.get('input[name="newPassword"]').should("be.visible");
  });

  it("Should navigate to the edit-profile page and back to overview", () => {
    cy.get('a[aria-label="link-/profile/edit"]').should("be.visible").click();
    cy.contains("Edit Profile").should("be.visible");

    cy.get('a[aria-label="link-/profile"]').should("be.visible").click();
    cy.contains("Overview").should("be.visible");
    cy.location("pathname").should("eq", "/profile");
  });

  it("Should show user profile informations with delete option", () => {
    cy.get('button[aria-label="deleteModalProfileBtn"]').should("be.visible");
    cy.contains("user-testing@example.com").should("be.visible");
  });

  it("Should open delete profile modal and close it", () => {
    cy.get('button[aria-label="deleteModalProfileBtn"]').click();

    cy.contains("Are you sure you want to delete your profile?").should(
      "be.visible"
    );

    cy.get('button[aria-label="closeDeleteProfileModalbtn"]').click();
    cy.contains("Are you sure you want to delete your profile?").should(
      "not.be.visible"
    );
  });
});
