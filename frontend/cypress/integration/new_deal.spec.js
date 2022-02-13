import createdAgoDateTime from "../../src/utils/createdAgoDateTime";
const faker = require("faker");
import "cypress-file-upload";

const randomEmail = faker.internet.email();
const randomUsername = faker.internet.userName();
const userPassword = "password";
const navLoginRegisterBtn = "[data-cy=nav-login-register-button]";
const loginModalBtn = "[data-cy=login-modal-button]";
const createAccBtn = "[data-cy=create-account-button]";

const getNewDealButton = () => cy.get("[data-cy=go-to-new-deal-button]");
const getNewDealTitleInput = () => cy.get("[data-cy=new-deal-title]");
const getNewDealDescriptionInput = () =>
  cy.get("[data-cy=new-deal-description]");
const getNewDealCategoryInput = () => cy.get("[data-cy=new-deal-category]");
const getNewDealPriceInput = () => cy.get("[data-cy=new-deal-price]");
const getNewDealDeliveryPriceInput = () =>
  cy.get("[data-cy=new-deal-delivery-price]");
const getNewDealExpirationDateInput = () =>
  cy.get("[data-cy=new-deal-expiration-date]");
const getNewDealLinkInput = () => cy.get("[data-cy=new-deal-link]");
const getNewDealImageInput = () => cy.get("[data-cy=new-deal-image]");
const getNewDealSubmitButton = () => cy.get("[data-cy=new-deal-submit-button]");

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

describe("Create new deal", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
  });

  it("Can create deal with minimal required data", function () {
    cy.intercept("POST", `/api/deals/`, {
      body: this.dealOne,
    });

    cy.intercept("GET", "api/deals/", {
      body: [],
    });
    cy.intercept("GET", `api/deals/${this.dealOne.id}/comments`, {
      status_code: 200,
      body: [],
    });

    cy.intercept("GET", `api/deals/${this.dealOne.id}/`, {
      status_code: 200,
      body: this.dealOne,
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealOne.title);
    getNewDealDescriptionInput().type(this.dealOne.description);
    getNewDealCategoryInput().select(this.dealOne.category);
    getNewDealSubmitButton().click();
  });

  it("Can create deal with all data fields", function () {
    cy.intercept("POST", `/api/deals/`, {
      body: this.dealTwo,
    });
    cy.intercept("GET", "api/deals/", {
      body: [],
    });
    cy.intercept("GET", `api/deals/${this.dealTwo.id}/comments`, {
      status_code: 200,
      body: [],
    });
    cy.intercept("GET", `api/deals/${this.dealTwo.id}/`, {
      status_code: 200,
      body: this.dealTwo,
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealTwo.title);
    getNewDealDescriptionInput().type(this.dealTwo.description);
    getNewDealCategoryInput().select(this.dealTwo.category);
    getNewDealPriceInput().type(this.dealTwo.price);
    getNewDealDeliveryPriceInput().type(this.dealTwo.postage_cost);
    getNewDealExpirationDateInput().type(
      new Date(this.dealTwo.deal_end_date).toISOString().slice(0, 10)
    );
    getNewDealLinkInput().type(this.dealTwo.url);
    getNewDealImageInput().attachFile("../fixtures/printer-image.jpg");
    getNewDealSubmitButton().click();
  });
});

describe("Create new deal errors", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
  });

  it("Show error for empty title and description fields", function () {
    cy.intercept("GET", "api/deals/", {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealSubmitButton().click();
    cy.get("[data-cy=new-deal-title-error]").should(
      "have.text",
      "This field is required."
    );
    cy.get("[data-cy=new-deal-description-error]").should(
      "have.text",
      "This field is required."
    );
  });

  it("Shows errors for invalid price inputs", function () {
    cy.intercept("GET", "api/deals/", {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealOne.title);
    getNewDealDescriptionInput().type(this.dealOne.description);
    getNewDealPriceInput().type("invalid");
    getNewDealDeliveryPriceInput().type("invalid");
    getNewDealSubmitButton().click();
    cy.get("[data-cy=new-deal-price-error]").should(
      "have.text",
      "A valid number is required."
    );
    cy.get("[data-cy=new-deal-delivery-price-error]").should(
      "have.text",
      "A valid number is required."
    );
  });

  it("Shows error for invalid expiration date", function () {
    cy.intercept("GET", "api/deals/", {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealOne.title);
    getNewDealDescriptionInput().type(this.dealOne.description);
    getNewDealExpirationDateInput().type("1997-01-01");
    getNewDealSubmitButton().click();
    cy.get("[data-cy=new-deal-expiration-date-error]").should(
      "have.text",
      "Invalid date. Please try again."
    );
  });

  it("Shows error for invalid url", function () {
    cy.intercept("GET", "api/deals/", {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealOne.title);
    getNewDealDescriptionInput().type(this.dealOne.description);
    getNewDealLinkInput().type("invalid-url");
    getNewDealSubmitButton().click();
    cy.get("[data-cy=new-deal-link-error]").should(
      "have.text",
      "Enter a valid URL."
    );
  });

  it("Shows error for invalid file type", function () {
    cy.intercept("GET", "api/deals/", {
      body: [],
    });

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getNewDealButton().click();
    getNewDealTitleInput().type(this.dealOne.title);
    getNewDealDescriptionInput().type(this.dealOne.description);
    getNewDealImageInput().attachFile("../fixtures/commentStubData.json");
    getNewDealSubmitButton().click();
    cy.get("[data-cy=new-deal-image-error]").should(
      "have.text",
      "Upload a valid image. The file you uploaded was either not an image or a corrupted image."
    );
  });
});
