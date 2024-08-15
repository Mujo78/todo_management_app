/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

interface CreateUpdateTaskType {
  title: string;
  description?: string;
  dueDate: string;
  priority: number;
  status?: number | 0;
}

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
    addTask(data: CreateUpdateTaskType): Chainable<void>;
    editTask(data: CreateUpdateTaskType): Chainable<void>;
    chooseTaskToAction(title?: string): Chainable<void>;
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

Cypress.Commands.add("addTask", (data) => {
  const { title, dueDate, priority, description } = data;

  const descriptionToUse = description ?? "";

  cy.get('input[name="title"]').should("be.visible").type(title);
  cy.get('input[name="dueDate"]').should("be.visible").type(dueDate);
  cy.get('textarea[name="description"]')
    .should("be.visible")
    .type(descriptionToUse);

  cy.get('div[aria-label="Priority"]').should("be.visible").click();

  cy.get(`li[data-value="${priority}"]`).click();

  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("editTask", (data) => {
  const { title, dueDate, priority, description } = data;

  cy.get('input[name="title"]').should("be.visible").clear().type(title);
  cy.get('input[name="dueDate"]').should("be.visible").type(dueDate);
  cy.get('textarea[name="description"]')
    .should("be.visible")
    .clear()
    .type(description!);

  cy.get('div[aria-label="Priority"]').should("be.visible").click();

  cy.get(`li[data-value="${priority}"]`).click();

  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("chooseTaskToAction", (title) => {
  const titleToUse = title ?? "First Task Created";
  cy.get(`span[aria-label="Label-${titleToUse}-task"]`)
    .find('input[type="checkbox"]')
    .click();

  cy.wait(1000);
});
