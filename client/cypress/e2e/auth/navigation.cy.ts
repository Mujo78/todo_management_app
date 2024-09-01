import { format } from "date-fns";

describe("Navigation functionality through the app testing", () => {
  beforeEach(() => {
    cy.login();
    cy.wait(1500);
  });

  const todaysDate = format(new Date(), "dd/MM/yyyy");

  describe("AppSidebar component testing", () => {
    it("Should display appSidebar component with its elements - english", () => {
      cy.get('li[aria-label="Tasks"]')
        .should("be.visible")
        .should("have.text", "Tasks");
      cy.get('li[aria-label="Profile"]')
        .should("be.visible")
        .should("have.text", "Profile");

      cy.get('button[aria-label="addNewTaskBtn"]')
        .should("be.visible")
        .should("have.text", "Add a new task");
    });

    it("Should display appSidebar component with its elements - bosnian", () => {
      cy.changeLngDropdown("bs");

      cy.get('li[aria-label="Tasks"]')
        .should("be.visible")
        .should("have.text", "Zadaci");
      cy.get('li[aria-label="Profile"]')
        .should("be.visible")
        .should("have.text", "Profil");

      cy.get('button[aria-label="addNewTaskBtn"]')
        .should("be.visible")
        .should("have.text", "Dodaj zadatak");
    });

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
    it("Should display todays date, menu and logo - english", () => {
      cy.get("a").should("have.text", "TaskMaster");
      cy.contains(todaysDate).should("be.visible");
      cy.get('button[aria-label="account of current user"]')
        .should("be.visible")
        .should("have.text", "Me");
    });

    it("Should display todays date, menu and logo - bosnian", () => {
      cy.changeLngDropdown("bs");
      cy.get("body").click();
      cy.wait(1000);
      cy.get("body").click();

      cy.get("a").should("have.text", "TaskMaster");
      cy.contains(todaysDate).should("be.visible");
      cy.get('button[aria-label="account of current user"]')
        .should("be.visible")
        .should("have.text", "Ja");
    });

    it("Should display dropdown with links to navigate provided", () => {
      cy.openMenu();
    });

    it("Should display logout button", () => {
      cy.openMenu();
      cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible");
    });

    it("Should display language switch btn with options - english", () => {
      cy.openMenu();

      cy.get('button[aria-label="LanguageBtn"]')
        .should("be.visible")
        .should("have.text", "Language")
        .click();

      cy.get('li[aria-label="EnglishLngItem"]')
        .should("be.visible")
        .should("have.text", "English");
      cy.get('li[aria-label="BosnianLngItem"]')
        .should("be.visible")
        .should("have.text", "Bosnian");
    });

    it("Should display language switch btn with options - bosnian", () => {
      cy.changeLngDropdown("bs");

      cy.get('li[aria-label="EnglishLngItem"]')
        .should("be.visible")
        .should("have.text", "Engleski");
      cy.get('li[aria-label="BosnianLngItem"]')
        .should("be.visible")
        .should("have.text", "Bosanski");

      cy.get("body").click();

      cy.get('button[aria-label="LanguageBtn"]')
        .should("be.visible")
        .should("have.text", "Jezik")
        .click();
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

    it("Should display tab navigation component with options - english", () => {
      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");

      cy.get('button[aria-label="TabNavBtnTasks"]')
        .should("be.visible")
        .should("have.text", "Tasks");
      cy.get('button[aria-label="TabNavBtnAdd"]')
        .should("be.visible")
        .should("have.text", "Add");
      cy.get('button[aria-label="TabNavBtnProfile"]')
        .should("be.visible")
        .should("have.text", "Profile");
    });

    it("Should display tab navigation component with options - bosnian", () => {
      cy.changeLngDropdown("bs");
      cy.get("body").click();
      cy.wait(1000);
      cy.get("body").click();
      cy.get('div[aria-label="bottomNavigation"]').should("be.visible");

      cy.get('button[aria-label="TabNavBtnTasks"]')
        .should("be.visible")
        .should("have.text", "Zadaci");
      cy.get('button[aria-label="TabNavBtnAdd"]')
        .should("be.visible")
        .should("have.text", "Dodaj");
      cy.get('button[aria-label="TabNavBtnProfile"]')
        .should("be.visible")
        .should("have.text", "Profil");
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

    it("Should display logout btn and language btn of appNavbar when tabNavigation is displayed", () => {
      cy.get("a").should("have.text", "TaskMaster");
      cy.contains(todaysDate).should("not.be.visible");

      cy.openMenu();
      cy.wait(1000);

      cy.get('li[aria-label="ProfileLink"]').should("not.exist");
      cy.get('li[aria-label="HomeLink"]').should("not.exist");
      cy.get('button[aria-label="LanguageBtn"]').should("be.visible");
      cy.get('li[aria-label="LogoutBtnLink"]').should("be.visible");
    });
  });
});
