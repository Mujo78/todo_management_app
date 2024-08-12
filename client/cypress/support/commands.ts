/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email?: string): Chainable<void>;
    forgotPassword(): Chainable<void>;
    resetPassword(
      newPassword: string,
      confirmNewPassword: string
    ): Chainable<void>;
    changePassword(
      oldPassword: string,
      newPassword: string,
      confirmNewPassword: string
    ): Chainable<void>;
    openMenu(): Chainable<void>;
  }
}

Cypress.Commands.add("login", (email) => {
  cy.visit("/");

  const emailToUse = email ?? "user-testing@example.com";

  cy.get('input[name="email"]').should("be.visible").type(emailToUse);
  cy.get('input[name="password"]').should("be.visible").type("Password&123456");
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("forgotPassword", () => {
  cy.visit("/forgot-password");

  cy.get('input[name="email"]')
    .should("be.visible")
    .type("user-testing@example.com");

  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("resetPassword", (newPassword, confirmNewPassword) => {
  cy.get('input[name="newPassword"]').should("be.visible").type(newPassword);
  cy.get('input[name="confirmNewPassword"]')
    .should("be.visible")
    .type(confirmNewPassword);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add(
  "changePassword",
  (oldPassword, newPassword, confirmNewPassword) => {
    cy.get('input[name="oldPassword"]').should("be.visible").type(oldPassword);
    cy.get('input[name="newPassword"]').should("be.visible").type(newPassword);
    cy.get('input[name="confirmNewPassword"]')
      .should("be.visible")
      .type(confirmNewPassword);
    cy.get('button[type="submit"]').click();
  }
);

Cypress.Commands.add("openMenu", () => {
  cy.get('button[aria-label="account of current user"]')
    .should("be.visible")
    .click();

  cy.get(".MuiMenu-list").should("be.visible");
});
