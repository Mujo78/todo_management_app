describe("Signup functionality tests", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Signup page should be visible with form and info element", () => {
    cy.contains("Sign up today!").should("be.visible");
    cy.contains("Welcome to TaskMaster").should("be.visible");

    cy.get('input[name="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
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
