describe("Signup functionality tests", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Signup page should be visible with form and info element - english language", () => {
    cy.contains("Sign up today!").should("be.visible");

    cy.get('input[name="email"]').should("be.visible").should("have.value", "");
    cy.get('input[name="name"]').should("be.visible").should("have.value", "");
    cy.get('label[id="Name-label"]')
      .should("be.visible")
      .should("have.text", "Name *");

    cy.get('input[name="password"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('label[id="Password-label"]')
      .should("be.visible")
      .should("have.text", "Password *");
    cy.get('input[name="confirmPassword"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get("#Confirm\\ Password-label")
      .should("be.visible")
      .should("have.text", "Confirm Password *");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Register");

    cy.contains("Welcome to TaskMaster").should("be.visible");
    cy.contains(
      "Boost your productivity with TaskMaster. Create, organize, and track your tasks effortlessly."
    ).should("be.visible");
    cy.contains("Why TaskMaster?").should("be.visible");
    cy.contains(
      "Join thousands of users taking control of their tasks today!"
    ).should("be.visible");
  });

  it("Signup page should be visible with form and info element - bosnian language", () => {
    cy.changeLng("bs");
    cy.contains("Registrujte se danas!").should("be.visible");

    cy.get('input[name="email"]').should("be.visible").should("have.value", "");
    cy.get('input[name="name"]').should("be.visible").should("have.value", "");
    cy.get('label[id="Name-label"]')
      .should("be.visible")
      .should("have.text", "Ime *");
    cy.get('input[name="password"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get('label[id="Lozinka-label"]')
      .should("be.visible")
      .should("have.text", "Lozinka *");
    cy.get('input[name="confirmPassword"]')
      .should("be.visible")
      .should("have.value", "");
    cy.get("#Potvrdi\\ Lozinku-label")
      .should("be.visible")
      .should("have.text", "Potvrdi Lozinku *");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("have.text", "Registracija");

    cy.contains("Dobrodošli u TaskMaster").should("be.visible");
    cy.contains(
      "Povećajte svoju produktivnost uz TaskMaster. Kreirajte, organizirajte i pratite svoje zadatke bez napora."
    ).should("be.visible");
    cy.contains("Zašto TaskMaster?").should("be.visible");
    cy.contains(
      "Pridružite se hiljadama korisnika koji preuzimaju kontrolu nad svojim zadacima već danas!"
    ).should("be.visible");
  });

  it("Should be possible to navigate to login page", () => {
    cy.get('a[aria-label="login"]').click();

    cy.contains("Log in to Your Account").should("be.visible");
  });

  it("Should return error message for password length", () => {
    signupFn({
      name: "Hello User One",
      email: "user@gmail.com",
      password: "hello",
      confirmPassword: "hello",
    });

    cy.contains("Password must be at least 8 characters long.");
  });

  it("Should show form validation error messages", () => {
    signupFn({
      name: "Helo",
      email: "admin@taskmaster.com",
      password: "Password",
      confirmPassword: "Password",
    });

    cy.contains("Name must be at least 5 characters long.");
    cy.contains(
      "Invalid email address, please provide valid email to create an account."
    );
    cy.contains(
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    );
  });

  it("Should return error when passwords dont match", () => {
    signupFn({
      name: "User One Testing",
      email: "user123@gmail.com",
      password: "Password&123456",
      confirmPassword: "Password&12345",
    });

    cy.contains("Passwords must match");
  });

  it("Should return Email already used", () => {
    signupFn({
      name: "User One Testing",
      email: "user-testing@example.com",
      password: "Password&123456",
      confirmPassword: "Password&123456",
    });

    cy.contains("Email is already used!");
  });

  it("Should successfully create user account", () => {
    signupFn({
      name: "User Two Testing",
      email: `user-testing-${Date.now()}@example.com`,
      password: "Password&123456",
      confirmPassword: "Password&123456",
    });

    cy.contains("Please check your inbox for verification email.").should(
      "be.visible"
    );
  });

  after(() => {
    cy.request("DELETE", "https://localhost:7196/reset-database");
  });
});

type signupArgs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const signupFn = (args: signupArgs) => {
  const { confirmPassword, email, name, password } = args;
  cy.get('input[name="name"]').should("be.visible").type(name);
  cy.get('input[name="email"]').should("be.visible").type(email);
  cy.get('input[name="password"]').should("be.visible").type(password);
  cy.get('input[name="confirmPassword"]')
    .should("be.visible")
    .type(confirmPassword);

  cy.get('button[type="submit"]').should("be.visible").click();
};
