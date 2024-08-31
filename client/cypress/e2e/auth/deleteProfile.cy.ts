describe("Delete Profile functionality testing", () => {
  beforeEach(() => {
    cy.login("user-testing-to-delete@example.com");
    cy.wait(1500);
  });

  it("Should display delete profile option and modal - english language", () => {
    cy.visit("/profile");
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .should("have.text", "Delete Account")
      .click();

    cy.contains("Are you sure you want to delete your profile?").should(
      "be.visible"
    );

    cy.contains("By deleting your profile, you will:").should("be.visible");
    cy.contains("- lose your profile forever,").should("be.visible");
    cy.contains("- your tasks will be deleted (0)").should("be.visible");

    cy.get('button[aria-label="closeDeleteProfileModalbtn"]')
      .should("be.visible")
      .should("have.text", "Close");
    cy.get('button[aria-label="confirmDeleteProfilebtn"]')
      .should("be.visible")
      .should("have.text", "Confirm");
  });

  it("Should display delete profile option and modal - bosnian language", () => {
    cy.visit("/profile");
    cy.changeLngDropdown("bs");

    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .should("have.text", "Izbriši račun")
      .click({ force: true });

    cy.contains("Jeste li sigurni da želite izbrisati svoj račun?").should(
      "be.visible"
    );

    cy.contains("Brisanjem profila, vi ćete:").should("be.visible");
    cy.contains("- izgubiti račun zauvijek,").should("be.visible");
    cy.contains("- obrisati sve zadatke (0)").should("be.visible");

    cy.get('button[aria-label="closeDeleteProfileModalbtn"]')
      .should("be.visible")
      .should("have.text", "Zatvori");
    cy.get('button[aria-label="confirmDeleteProfilebtn"]')
      .should("be.visible")
      .should("have.text", "Potvrdi");
  });

  it("Should successfully delete profile", () => {
    cy.visit("/profile");
    cy.get('button[aria-label="deleteModalProfileBtn"]')
      .should("be.visible")
      .click();

    cy.get('button[aria-label="confirmDeleteProfilebtn"]')
      .should("be.visible")
      .click();

    cy.wait(1500);
    cy.location("pathname").should("eq", "/");
    cy.login("user-testing-to-delete@example.com");

    cy.contains("Account doesn't exists.").should("be.visible");
  });

  after(() => {
    cy.wait(1500);
    cy.request("POST", "https://localhost:7196/seed-database-user");
    cy.reload();
  });
});
