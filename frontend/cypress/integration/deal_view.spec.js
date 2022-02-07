import createdAgoDateTime from "../../src/utils/createdAgoDateTime";
const faker = require("faker");

const randomEmail = faker.internet.email();
const randomUsername = faker.internet.userName();
const userPassword = "password";

const ARROW_COLOUR =
  "invert(0.46) sepia(0.81) saturate(46.19) hue-rotate(187deg) brightness(0.96) contrast(0.93)";
const navLoginRegisterBtn = "[data-cy=nav-login-register-button]";
const loginModalBtn = "[data-cy=login-modal-button]";
const createAccBtn = "[data-cy=create-account-button]";
const getDealTitle = (title) => cy.get("div").contains(title);
const getDealRating = () => cy.get("[data-cy=deal-view-rating] > p");
const getDealRateUpIcon = () =>
  cy.get("[data-cy=deal-view-rating] > #rate-deal-up");
const getDealRateDownIcon = () =>
  cy.get("[data-cy=deal-view-rating] > #rate-deal-down");
const getDealPrice = () => cy.get("[data-cy=deal-view-deal-price]");
const getDealPostageCost = () => cy.get("[data-cy=deal-view-postage-cost]");
const getDealImage = () => cy.get("[data-cy=deal-view-image]");
const getDealUserName = () => cy.get("[data-cy=deal-view-user] > p");
const getDealUserProfilePicture = () =>
  cy.get("[data-cy=deal-view-user] > img");
const getDealCreatedDate = () => cy.get("[data-cy=deal-view-posted-date]");
const getDealExpirationDate = () =>
  cy.get("[data-cy=deal-view-expiration-date]");
const getDealCommentTotal = () => cy.get("[data-cy=deal-view-comments-total]");
const getDealGetDealBtn = () => cy.get("[data-cy=deal-view-get-deal]");
const getDealDescription = () => cy.get("[data-cy=deal-view-description]");

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

describe("Deal view displays correct information", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Deal view with no expiration date, no price and no postage cost displays correct data", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.visit(`deal/${this.dealOne.id}/`);
    getDealTitle(this.dealOne.title).should("have.text", this.dealOne.title);
    getDealRating().should("have.text", this.dealOne.rating);
    getDealPrice().should("not.exist");
    getDealPostageCost().should("not.exist");
    getDealImage()
      .should("have.attr", "src")
      .should("include", this.dealOne.image);
    getDealUserName().should("have.text", this.dealOne.user.username);
    getDealUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.dealOne.user.profile_picture);
    getDealCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.dealOne.created)}`
    );
    getDealExpirationDate().should("not.exist");
    getDealCommentTotal().should("have.text", this.dealOne.total_comments);
    getDealGetDealBtn()
      .should("have.attr", "href")
      .should("include", this.dealOne.url);
    getDealDescription().should("have.text", this.dealOne.description);
  });

  it("Deal with expiration date, price and postage cost displays correct data", function () {
    cy.intercept("GET", `/api/deals/${this.dealTwo.id}/`, {
      statusCode: 200,
      body: this.dealTwo,
    }).as("deal");

    cy.visit(`deal/${this.dealTwo.id}/`);
    getDealTitle(this.dealTwo.title).should("have.text", this.dealTwo.title);
    getDealRating().should("have.text", this.dealTwo.rating);
    getDealPrice().should("have.text", `£ ${this.dealTwo.price}`);
    getDealPostageCost().should("have.text", `£ ${this.dealTwo.postage_cost}`);
    getDealImage()
      .should("have.attr", "src")
      .should("include", this.dealTwo.image);
    getDealUserName().contains(this.dealTwo.user.username);
    getDealUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.dealTwo.user.profile_picture);
    getDealCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.dealTwo.created)}`
    );
    getDealExpirationDate().should(
      "have.text",
      `Expires ${new Date(this.dealTwo.deal_end_date).toLocaleDateString(
        "en-US"
      )}`
    );
    getDealCommentTotal().should("have.text", this.dealTwo.total_comments);
    getDealGetDealBtn()
      .should("have.attr", "href")
      .should("include", `${this.dealTwo.url}`);
    getDealDescription().should("have.text", this.dealTwo.description);
  });
});

describe("Deal view rate functions", function () {
  beforeEach(function () {
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Authorised user can up vote in deal view", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", +this.dealOne.rating + 1);
    getDealRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo up vote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: {
        ...this.dealOne,
        rating: +this.dealOne.rating + 1,
        rated_by_user: true,
      },
    }).as("deal");
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: this.dealOne,
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");

    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", +this.dealOne.rating + 1);
    getDealRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");

    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", +this.dealOne.rating - 1);
    getDealRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo down vote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: {
        ...this.dealOne,
        rating: +this.dealOne.rating - 1,
        rated_by_user: false,
      },
    }).as("deal");
    console.log(this.dealOne);
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: this.dealOne,
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", +this.dealOne.rating - 1);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", +this.dealOne.rating);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote from up vote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}`, {
      statusCode: 200,
      body: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", +this.dealOne.rating + 1);
    getDealRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", +this.dealOne.rating - 1);
    getDealRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can up vote from down vote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(this.user.username, this.user.password);
    getDealRating().should("have.text", +this.dealOne.rating - 1);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().click();
    cy.wait("@dealVote");
    getDealRating().should("have.text", +this.dealOne.rating + 1);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });

  it("Unauthorised user can't rate deal up", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().click();
    cy.get("[data-cy=login-modal-background]").should("exist");
    cy.get("[data-cy=login-modal-main]").should("exist");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unauthorised user can't rate deal down", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().click();
    cy.get("[data-cy=login-modal-background]").should("exist");
    cy.get("[data-cy=login-modal-main]").should("exist");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified user can't rate deal up", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    cy.get(navLoginRegisterBtn).click();
    cy.get("span").contains("Create new account").click();
    cy.get("[data-cy=register-username]").type(randomUsername);
    cy.get("[data-cy=register-email]").type(randomEmail);
    cy.get("[data-cy=register-password]").type(userPassword);
    cy.get("[data-cy=register-password-repeat]").type(userPassword);
    cy.get(createAccBtn).click();
    cy.wait("@signUp");
    cy.get("[data-cy=response-close-button]").click();
    cy.get("[data-cy=register-modal]").should("not.exist");
    loginUser(randomUsername, userPassword);

    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateUpIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified user can't rate deal down", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(randomUsername, userPassword);
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    getDealRating().should("have.text", this.dealOne.rating);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified users can close unverified email modal", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.wait("@deal");
    loginUser(randomUsername, userPassword);
    getDealRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    cy.get("body").click(0, 0);
    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    cy.get("[data-cy=verify-email-modal-main]").should("not.exist");
    getDealRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    cy.get("[data-cy=verify-email-modal-close-icon]").click();
    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    cy.get("[data-cy=verify-email-modal-main]").should("not.exist");
  });
});
