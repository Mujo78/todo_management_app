describe("Profile Overview functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/profile");
  });

  it("Should display user profile informations with delete option - english language", () => {
    cy.contains("Overview").should("be.visible");
    cy.get('a[aria-label="link-/profile"]')
      .should("be.visible")
      .should("have.text", "Overview");
    cy.get('a[aria-label="link-/profile/edit"]')
      .should("be.visible")
      .should("have.text", "Edit");
    cy.get('a[aria-label="link-/profile/change-password"]')
      .should("be.visible")
      .should("have.text", "Change Password");

    cy.contains("user-testing@example.com").should("be.visible");
    cy.contains("Name/Username:").should("be.visible");
    cy.contains("Joined:").should("be.visible");
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .should("have.text", "Delete Account");

    cy.contains("Total").should("be.visible");
    cy.contains("Completed").should("be.visible");
    cy.contains("Failed").should("be.visible");
    cy.contains("Open").should("be.visible");

    cy.get("#average_level")
      .should("be.visible")
      .should("have.text", "Average");
  });

  it("Should display user profile informations with delete option - bosnian language", () => {
    cy.changeLngDropdown("bs");

    cy.contains("Pregled profila").should("be.visible");
    cy.get('a[aria-label="link-/profile"]')
      .should("be.visible")
      .should("have.text", "Pregled");
    cy.get('a[aria-label="link-/profile/edit"]')
      .should("be.visible")
      .should("have.text", "Uredi");
    cy.get('a[aria-label="link-/profile/change-password"]')
      .should("be.visible")
      .should("have.text", "Promjena lozinke");

    cy.contains("user-testing@example.com").should("be.visible");
    cy.contains("Ime/Korisničko ime:").should("be.visible");
    cy.contains("Pridružio se:").should("be.visible");
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .should("have.text", "Izbriši račun");

    cy.contains("Ukupno").should("be.visible");
    cy.contains("Dovršeno").should("be.visible");
    cy.contains("Neuspješno").should("be.visible");
    cy.contains("Trenutni").should("be.visible");

    cy.get("#average_level")
      .should("be.visible")
      .should("have.text", "Prosjek");
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
