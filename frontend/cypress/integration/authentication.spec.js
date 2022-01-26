const faker = require("faker");

const randomEmail = faker.internet.email();
const randomUsername = faker.internet.userName();
const randomPassword = "password";
const invalidPassword = "a";

const registrationBtn = "[data-cy=nav-register-button]";
const createAccBtn = "[data-cy=create-account-button]";
const loginNavBtn = "[data-cy=nav-login-button]";
const loginModalBtn = "[data-cy=login-modal-button]";
const navAccountImg = "[data-cy=nav-account-image]";
const logoutAccBtn = "[data-cy=nav-account-menu-logout]";

describe("User register new user", function () {
  it("Can close registration modal by clicking background and X", function () {
    cy.visit("");
    cy.get(registrationBtn).click();
    cy.get("body").click(0, 0);
    cy.get(registrationBtn).click();
    cy.get("[data-cy=register-modal-close-icon]").click();
  });

  it("Loading bar visable whilie waiting for API response", function () {
    cy.intercept("POST", "**/api/sign_up/", (req) => {
      req.reply({
        delay: 2000,
        ...req,
      });
    }).as("signUp");
    cy.visit("");
    cy.get(registrationBtn).click();
    cy.get(createAccBtn).click();
    cy.get("[data-cy=loader-background]");
    cy.get("[data-cy=loader-container]");
    cy.get("[data-cy=loader]");
    cy.wait("@signUp");
    cy.get("[data-cy=loader-background]").should("not.exist");
    cy.get("[data-cy=loader-container]").should("not.exist");
    cy.get("[data-cy=loader]").should("not.exist");
  });

  it("Can use register form", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.visit("");
    cy.get(registrationBtn).click();
    cy.get("[data-cy=register-username]").type(randomUsername);
    cy.get("[data-cy=register-email]").type(randomEmail);
    cy.get("[data-cy=register-password]").type(randomPassword);
    cy.get("[data-cy=register-password-repeat]").type(randomPassword);

    cy.get(createAccBtn).click();
    cy.wait("@signUp");
    cy.get("[data-cy=response-title]").should("have.text", randomUsername);
    cy.get("[data-cy=response-text]").should(
      "have.text",
      "Your account has been created. You can now login. But first please check your inbox and validate your email."
    );
    cy.get("[data-cy=response-close-button]").click();
    cy.get("[data-cy=register-modal]").should("not.exist");
  });
});

describe("User registration invalid tests", function () {
  it("Shows API errors if invalid values submitted to API", function () {
    const errMsg = "This field may not be blank.";
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.visit("");
    cy.get(registrationBtn).click();
    cy.get(createAccBtn).click();
    cy.wait("@signUp");
    cy.get("[data-cy=register-username-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-email-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-password-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-password-repeat-error]").should(
      "have.text",
      errMsg
    );
  });
});

describe("User login", function () {
  it("Can close login modal by clicking background and X", function () {
    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("body").click(0, 0);
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-modal-close-icon]").click();
  });

  it("Loading bar visable whilie waiting for API response", function () {
    cy.intercept("POST", "api/log_in/", (req) => {
      req.reply({
        delay: 3000,
        statusCode: 400,
        body: {},
      });
    }).as("loginApiCall");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get(loginModalBtn).click();
    cy.get("[data-cy=loader-background]");
    cy.get("[data-cy=loader-container]");
    cy.get("[data-cy=loader]");
    cy.wait("@loginApiCall");
    cy.get("[data-cy=loader-background]").should("not.exist");
    cy.get("[data-cy=loader-container]").should("not.exist");
    cy.get("[data-cy=loader]").should("not.exist");
  });

  it("User can login with username", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomUsername);
    cy.get("[data-cy=login-password]").type(randomPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");
    cy.get("[data-cy=login-modal-background]").should("not.exist");
    cy.get("[data-cy=login-modal-main]").should("not.exist");
  });

  it("User can login with email", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomEmail);
    cy.get("[data-cy=login-password]").type(randomPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");
    cy.get("[data-cy=login-modal-background]").should("not.exist");
    cy.get("[data-cy=login-modal-main]").should("not.exist");
  });
});

describe("User login invalid tests ", function () {
  it("No username & password login", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");
    cy.get("[data-cy=login-username-error]").should(
      "have.text",
      "This field may not be blank."
    );
    cy.get("[data-cy=login-password-error]").should(
      "have.text",
      "This field may not be blank."
    );
  });

  it("Invalid login credentials", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomUsername);
    cy.get("[data-cy=login-password]").type(invalidPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");
    cy.get("[data-cy=login-detail-error]").should(
      "have.text",
      "No active account found with the given credentials"
    );
  });
});

describe("User logout", function () {
  it("Can logout user", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomUsername);
    cy.get("[data-cy=login-password]").type(randomPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");

    cy.get("[data-cy=nav-account-image]").click();
    cy.get("[data-cy=nav-account-menu-logout]").click();
    cy.get("[data-cy=logout-confirmation-modal-background]").should("exist");
    cy.get("[data-cy=logout-confirmation-title]").contains(
      "Are you sure you wish to logout?"
    );
    cy.get("[data-cy=logout-confirmation-yes-button]").contains("Yes");
    cy.get("[data-cy=logout-confirmation-no-button]").contains("No");

    cy.get("[data-cy=logout-confirmation-yes-button]").click();
    cy.get("[data-cy=nav-account-image]").should("not.exist");
    cy.get("[data-cy=nav-login-button]").should("exist");
    cy.get("[data-cy=nav-register-button]").should("exist");
  });
});

describe("User logout", function () {
  it("Can close logout modal by clicking background, X and No", function () {
    cy.intercept("POST", "api/log_in").as("logIn");
    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomUsername);
    cy.get("[data-cy=login-password]").type(randomPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");

    cy.get(navAccountImg).click();
    cy.get(logoutAccBtn).click();
    cy.get("body").click(0, 0);
    cy.get(logoutAccBtn).click();
    cy.get("[data-cy=logout-confirmation-modal-close-icon]").click();
    cy.get(logoutAccBtn).click();
    cy.get("[data-cy=logout-confirmation-no-button]").click();
    cy.get("[data-cy=nav-account-image]").should("exist");
    cy.get("[data-cy=nav-login-button]").should("not.exist");
    cy.get("[data-cy=nav-register-button]").should("not.exist");
  });

  it("Can logout user", function () {
    cy.intercept("POST", "api/log_in").as("logIn");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(randomUsername);
    cy.get("[data-cy=login-password]").type(randomPassword);
    cy.get(loginModalBtn).click();
    cy.wait("@logIn");

    cy.get(navAccountImg).click();
    cy.get(logoutAccBtn).click();
    cy.get("[data-cy=logout-confirmation-modal-background]").should("exist");
    cy.get("[data-cy=logout-confirmation-title]").contains(
      "Are you sure you wish to logout?"
    );
    cy.get("[data-cy=logout-confirmation-yes-button]").contains("Yes");
    cy.get("[data-cy=logout-confirmation-no-button]").contains("No");

    cy.get("[data-cy=logout-confirmation-yes-button]").click();
    cy.get(navAccountImg).should("not.exist");
    cy.get("[data-cy=nav-login-button]").should("exist");
    cy.get("[data-cy=nav-register-button]").should("exist");
  });
});
