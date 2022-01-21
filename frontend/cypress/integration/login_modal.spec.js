import { testUserOne } from "../testing-variables.js";
const loginNavBtn = "[data-cy=login-nav-button]";
const loginModalBtn = "[data-cy=login-modal-button]";

describe("User login", function () {
  it("Login modal with background exists", function () {
    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-modal-background]");
    cy.get("[data-cy=login-modal-main]");
    cy.get("[data-cy=login-modal-close-icon]");
  });

  it("Can close login modal by clicking background and X", function () {
    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("body").click(0, 0);
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-modal-close-icon]").click();
  });

  it("Loading bar visable whilie waiting for API response", function () {
    cy.intercept("POST", "**/api/log_in/", (req) => {
      req.reply({
        delay: 3000,
        statusCode: 200,
        body: {
          access: "ACCESS_TOKEN",
          refresh: "REFRESH_TOKEN",
        },
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

  it("User can login", function () {
    cy.intercept("POST", "**/api/log_in/", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          access: "ACCESS_TOKEN",
          refresh: "REFRESH_TOKEN",
        },
      });
    }).as("loginApiCall");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get("[data-cy=login-username]").type(testUserOne.username);
    cy.get("[data-cy=login-password]").type(testUserOne.password);
    cy.get(loginModalBtn).click();
    cy.wait("@loginApiCall");
    cy.get("[data-cy=login-modal-background]").should("not.exist");
    cy.get("[data-cy=login-modal-main]").should("not.exist");
  });
});

describe("User login invalid tests ", function () {
  it("No username & password login", function () {
    cy.intercept("POST", "**/api/log_in/", (req) => {
      req.reply({
        statusCode: 400,
        body: {
          username: "This field is required.",
          password: "This field is required.",
        },
      });
    }).as("loginApiCall");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get(loginModalBtn).click();
    cy.wait("@loginApiCall");
    cy.get("[data-cy=login-username-error]").should(
      "have.text",
      "This field is required."
    );
    cy.get("[data-cy=login-password-error]").should(
      "have.text",
      "This field is required."
    );
  });

  it("Invalid login credentials", function () {
    cy.intercept("POST", "**/api/log_in/", (req) => {
      req.reply({
        statusCode: 400,
        body: {
          detail: "No active account found with the given credentials",
        },
      });
    }).as("loginApiCall");

    cy.visit("");
    cy.get(loginNavBtn).click();
    cy.get(loginModalBtn).click();
    cy.wait("@loginApiCall");
    cy.get("[data-cy=login-detail-error]").should(
      "have.text",
      "No active account found with the given credentials"
    );
  });
});
