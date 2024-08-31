describe("Login functionality testing", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("LoginPage should be visible with form and info element - english language", () => {
    cy.contains("Log in to Your Account").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('label[id="Password-label"]')
      .should("be.visible")
      .should("have.text", "Password *");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Log in");
    cy.get('a[aria-label="forgotPassword"]')
      .should("be.visible")
      .should("have.text", "Forgot Password?");

    cy.contains("Welcome to TaskMaster").should("be.visible");
    cy.contains(
      "Boost your productivity with TaskMaster. Create, organize, and track your tasks effortlessly."
    ).should("be.visible");
    cy.contains("Why TaskMaster?").should("be.visible");
    cy.contains(
      "Join thousands of users taking control of their tasks today!"
    ).should("be.visible");
  });

  it("LoginPage should be visible with form and info element - bosnian language", () => {
    cy.changeLng("bs");
    cy.contains("Prijavite se na Vaš račun").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('label[id="Lozinka-label"]')
      .should("be.visible")
      .should("have.text", "Lozinka *");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Prijava");
    cy.get('a[aria-label="forgotPassword"]')
      .should("be.visible")
      .should("have.text", "Zaboravljena lozinka?");

    cy.contains("Dobrodošli u TaskMaster").should("be.visible");
    cy.contains(
      "Povećajte svoju produktivnost uz TaskMaster. Kreirajte, organizirajte i pratite svoje zadatke bez napora."
    ).should("be.visible");
    cy.contains("Zašto TaskMaster?").should("be.visible");
    cy.contains(
      "Pridružite se hiljadama korisnika koji preuzimaju kontrolu nad svojim zadacima već danas!"
    ).should("be.visible");
  });

  it("Should navigate to the SignupPage successfully", () => {
    cy.get('a[aria-label="signup"]').click();

    cy.contains("Sign up today!").should("be.visible");
  });

  it("Should navigate to the ForgotPasswordPage successfully", () => {
    cy.get('a[aria-label="forgotPassword"]').click();

    cy.contains("Forgot Your Password?").should("be.visible");
  });

  it("Should return message when account is not found", () => {
    cy.get('input[name="email"]').should("be.visible").type("user@example.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Password&123456");
    cy.get('button[type="submit"]').click();

    cy.contains("Account doesn't exists.");
  });

  it("Should return incorrect email or password", () => {
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("user-testing@example.com");
    cy.get('input[name="password"]')
      .should("be.visible")
      .type("Password&1234567890");
    cy.get('button[type="submit"]').click();

    cy.contains("Incorrect email or password.").should("be.visible");
  });

  it("Should successfully log in", () => {
    cy.login();

    cy.wait(2000);
    cy.getCookie("refreshToken").should("exist");
  });
});
