describe("Navigation functionality through the app testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
  });

  describe("AppSidebar component testing", () => {
    it("Should navigate to the profile page", () => {
      cy.get('li[aria-label="Profile"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/profile");
      cy.contains("Overview").should("be.visible");
    });

    it("Should navigate to the add-task page", () => {
      cy.get('button[aria-label="addNewTaskBtn"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/add-task");
      cy.contains("Add a new Task").should("be.visible");
    });

    it("Should navigate from profile to tasks/home page", () => {
      cy.visit("/profile");

      cy.get('li[aria-label="Tasks"]').should("be.visible").click();
      cy.location("pathname").should("eq", "/home");
    });

    it("Should navigate back from add-task page to home page", () => {
      cy.get('button[aria-label="addNewTaskBtn"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/add-task");
      cy.contains("Add a new Task").should("be.visible");

      cy.get('button[aria-label="BackButton"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/home");
    });
  });

  describe("AppNavbar component testing", () => {
    it("Should show dropdown with links to navigate provided", () => {
      cy.openMenu();
    });

    it("Should show logout button", () => {
      cy.openMenu();
      cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible");
    });

    it("Should navigate to the profile page", () => {
      cy.openMenu();
      cy.get('li[aria-label="ProfileLink"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/profile");
      cy.contains("Overview").should("be.visible");
    });

    it("Should navigate to the home page", () => {
      cy.openMenu();
      cy.get('li[aria-label="ProfileLink"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/profile");
      cy.contains("Overview").should("be.visible");

      cy.get('li[aria-label="HomeLink"]').should("be.visible").click();
      cy.location("pathname").should("eq", "/home");
    });
  });

  describe("TabNavigation component testing", () => {
    beforeEach(() => {
      cy.viewport("samsung-s10");
    });

    it("Should display tab navigation component with options", () => {
      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");

      cy.get('button[aria-label="TabNavBtnTasks"]').should("be.visible");
      cy.get('button[aria-label="TabNavBtnAdd"]').should("be.visible");
      cy.get('button[aria-label="TabNavBtnProfile"]').should("be.visible");
    });

    it("Should navigate to the add-task page", () => {
      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");
      cy.get('button[aria-label="TabNavBtnAdd"]').should("be.visible").click();

      cy.location("pathname").should("eq", "/add-task");
      cy.contains("Add a new Task").should("be.visible");
    });

    it("Should navigate to the profile page", () => {
      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");
      cy.get('button[aria-label="TabNavBtnProfile"]')
        .should("be.visible")
        .click();

      cy.location("pathname").should("eq", "/profile");
      cy.contains("Overview").should("be.visible");
    });

    it("Should navigate to the home page", () => {
      cy.visit("/add-task");

      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");
      cy.get('button[aria-label="TabNavBtnTasks"]')
        .should("be.visible")
        .click();

      cy.location("pathname").should("eq", "/home");
    });
  });
});
