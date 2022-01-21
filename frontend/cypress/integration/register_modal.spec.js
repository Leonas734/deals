import { testUserOne } from "../testing-variables.js";
const regBtn = "[data-cy=register-button]";
const createAccBtn = "[data-cy=create-account-button]";

describe("Successful registration", function () {
  it("Register modal with background exists", function () {
    cy.visit("");
    cy.get(regBtn).click();
    cy.get("[data-cy=register-modal-background]");
    cy.get("[data-cy=register-modal-main]");
    cy.get("[data-cy=register-modal-close-icon]");
  });

  it("Can close registration modal by clicking background and X", function () {
    cy.visit("");
    cy.get(regBtn).click();
    cy.get("body").click(0, 0);
    cy.get(regBtn).click();
    cy.get("[data-cy=register-modal-close-icon]").click();
  });

  it("Loading bar visable whilie waiting for API response", function () {
    cy.intercept("POST", "**/api/sign_up/", (req) => {
      req.reply({
        delay: 2000,
        ...req,
      });
    }).as("regApiCall");
    cy.visit("");
    cy.get(regBtn).click();
    cy.get(createAccBtn).click();
    cy.get("[data-cy=loader-background]");
    cy.get("[data-cy=loader-container]");
    cy.get("[data-cy=loader]");
    cy.wait("@regApiCall");
    cy.get("[data-cy=loader-background]").should("not.exist");
    cy.get("[data-cy=loader-container]").should("not.exist");
    cy.get("[data-cy=loader]").should("not.exist");
  });
});

it("Can use register form", function () {
  cy.intercept("POST", "**/api/sign_up/", {
    statusCode: 201,
    body: {
      username: testUserOne.username,
    },
  }).as("regApiCall");

  cy.visit("");
  cy.get(regBtn).click();

  cy.get("[data-cy=register-username]").type(testUserOne.username);
  cy.get("[data-cy=register-email]").type(testUserOne.email);
  cy.get("[data-cy=register-password]").type(testUserOne.password);
  cy.get("[data-cy=register-password-repeat]").type(testUserOne.password);

  cy.get(createAccBtn).click();
  cy.wait("@regApiCall");
  cy.get("[data-cy=response-title]").should("have.text", testUserOne.username);
  cy.get("[data-cy=response-text]").should(
    "have.text",
    "Your account has been created. You can now login. But first please check your inbox and validate your email."
  );
  cy.get("[data-cy=response-close-button]").click();
  cy.get("[data-cy=register-modal]").should("not.exist");
});

describe("Registration invalid tests", function () {
  it("Shows API errors if invalid values submitted to API", function () {
    const errMsg = "This field may not be blank.";
    cy.intercept("POST", "**/api/sign_up/", {
      statusCode: 404,
      body: {
        username: errMsg,
        email: errMsg,
        password: errMsg,
        password_repeat: errMsg,
      },
    }).as("regApiCall");

    cy.visit("");
    cy.get(regBtn).click();
    cy.get(createAccBtn).click();
    cy.wait("@regApiCall");
    cy.get("[data-cy=register-username-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-email-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-password-error]").should("have.text", errMsg);
    cy.get("[data-cy=register-password-repeat-error]").should(
      "have.text",
      errMsg
    );
  });
});
