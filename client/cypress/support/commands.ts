/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    forgotPassword(): Chainable<void>;
  }
}

Cypress.Commands.add("login", () => {
  cy.visit("/");

  cy.get('input[name="email"]')
    .should("be.visible")
    .type("user-testing@example.com");
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
