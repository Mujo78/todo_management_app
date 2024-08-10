describe("Verify Email functionality testing", () => {
  it("Should show text informations to the user", () => {
    cy.visit("/verify-email/c8f37f0c-b813-4b42-b3f5-6883e653456e");

    cy.contains("Verify your email address").should("be.visible");
    cy.contains(
      "By verifying your email, you will confirm that you want to use this as your TaskMaster account email address. Once it's done you will be able to start with creating and achieving your daily goals."
    ).should("be.visible");
  });

  it("Should make request and return invalid token provided response", () => {
    cy.visit("/verify-email/c8f37f0c-b813-4b42-b3f5-6883e653456e");

    cy.contains("Invalid token provided. Token not found.").should(
      "be.visible"
    );
  });

  it("Should successfully verify email address", () => {
    cy.visit("/verify-email/25f78624-0c9b-4b63-b61e-d5b297e56f82");

    cy.contains("Successfully verified email address.", {
      timeout: 10000,
    }).should("be.visible");
  });
});
