describe("Edit Profile functionality testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
    cy.visit("/profile/edit");
  });

  it("Should show form for editing profile", () => {
    cy.get('input[name="name"]').should("be.visible");
    cy.get('input[name="email"]').should("be.visible");

    cy.get('button[type="submit"]').should("be.visible");
  });

  it("Should show form validation error messages", () => {
    cy.get('input[name="name"]').should("be.visible").clear().type("Name");
    cy.get('input[name="email"]')
      .should("be.visible")
      .clear()
      .type("admin@gmail.com");

    cy.get('button[type="submit"]').click();

    cy.contains("Name must be at least 5 characters long.").should(
      "be.visible"
    );
    cy.contains(
      "Invalid email address, please provide valid email to create an account."
    ).should("be.visible");
  });

  it("Should return Email already used error message", () => {
    cy.get('input[name="email"]')
      .should("be.visible")
      .clear()
      .type("user-testing-second@example.com");

    cy.get('button[type="submit"]').click();

    cy.contains("Email is already used!").should("be.visible");
  });

  it("Should successfully edit user profile (name only)", () => {
    cy.get('input[name="name"]')
      .should("be.visible")
      .clear()
      .type("User Testing One and Only");

    cy.get('button[type="submit"]').click();

    cy.contains("Profile successfully updated.").should("be.visible");
  });

  after(() => {
    cy.getAllLocalStorage().then((localStorage) => {
      const token = localStorage["http://localhost:5173"].auth;
      if (token) {
        const options = {
          method: "PUT",
          url: "https://localhost:7196/api/v1/users",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            id: "5979e203-2d8e-4b99-bde3-2881fefe96e4",
            name: "User Testing One",
            createdAt: new Date(),
            email: "user-testing@example.com",
            emailConfirmed: true,
          },
        };
        cy.request(options);
      }
    });
  });
});
