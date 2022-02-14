import "cypress-file-upload";
const faker = require("faker");
const randomEmail = faker.internet.email();
const randomPassword = faker.internet.password();
const navLoginRegisterBtn = "[data-cy=nav-login-register-button]";
const loginModalBtn = "[data-cy=login-modal-button]";
const navAccBtn = "[data-cy=nav-account-button]";
const navAccSettings = "[data-cy=nav-account-settings]";

const loginUser = (username, password) => {
  cy.intercept("POST", "api/log_in").as("logIn");
  cy.get(navLoginRegisterBtn).click();
  cy.get("[data-cy=login-username]").type(username);
  cy.get("[data-cy=login-password]").type(password);
  cy.get(loginModalBtn).click();
  cy.wait("@logIn");
  cy.get("[data-cy=login-modal-background]").should("not.exist");
  cy.get("[data-cy=login-modal-main]").should("not.exist");
};

describe("Update user details", function () {
  beforeEach(function () {
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
  });

  it("Can update user email", function () {
    cy.intercept("POST", `/api/deals/`, {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    cy.get(navAccBtn).click();
    cy.get(navAccSettings).click();
    cy.get("[data-cy=account-settings-update-email]").click();
    cy.get("[data-cy=account-settings-update-email-cur-pass]").type(
      this.user.password
    );
    cy.get("[data-cy=account-settings-update-email-new-email]").type(
      randomEmail
    );
    cy.get("[data-cy=account-settings-update-user-email-btn]").click();
    cy.get("[data-cy=account-settings-update-email-response]").should(
      "have.text",
      "Email updated successfully."
    );
  });

  it("Can update user password", function () {
    cy.intercept("POST", `/api/deals/`, {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    cy.get(navAccBtn).click();
    cy.get(navAccSettings).click();
    cy.get("[data-cy=account-settings-update-password]").click();
    cy.get("[data-cy=account-settings-update-password-cur-pass]").type(
      this.user.password
    );
    cy.get("[data-cy=account-settings-update-password-new-password]").type(
      randomPassword
    );
    cy.get(
      "[data-cy=account-settings-update-password-new-password-repeat]"
    ).type(randomPassword);
    cy.get("[data-cy=account-settings-update-user-password-btn]").click();

    loginUser(this.user.username, randomPassword);

    cy.get(navAccBtn).click();
    cy.get(navAccSettings).click();
    cy.get("[data-cy=account-settings-update-password]").click();
    cy.get("[data-cy=account-settings-update-password-cur-pass]").type(
      randomPassword
    );
    cy.get("[data-cy=account-settings-update-password-new-password]").type(
      this.user.password
    );
    cy.get(
      "[data-cy=account-settings-update-password-new-password-repeat]"
    ).type(this.user.password);
    cy.get("[data-cy=account-settings-update-user-password-btn]").click();
  });

  it("Can update user profile picture", function () {
    cy.intercept("POST", `/api/deals/`, {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    cy.get(navAccBtn).click();
    cy.get(navAccSettings).click();
    cy.get("[data-cy=account-settings-update-profile-picture]").click();
    cy.get("[data-cy=account-settings-update-profile-picture-cur-pass]").type(
      this.user.password
    );
    cy.get(
      "[data-cy=account-settings-update-profile-picture-new-pic]"
    ).attachFile("../fixtures/printer-image.jpg");
    cy.get("[data-cy=account-settings-update-user-profile-pic-btn]").click();
    cy.get("[data-cy=account-settings-update-password-response]").should(
      "have.text",
      "Profile picture updated successfully."
    );
  });
});
