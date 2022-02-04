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
const getDealViewTitle = (title) => cy.get("div").contains(title);
const getDealViewRating = () => cy.get("[data-cy=deal-list-view-rating] > p");
const getDealViewRateUpIcon = () =>
  cy.get("[data-cy=deal-list-view-rating] > #rate-deal-up");
const getDealViewRateDownIcon = () =>
  cy.get("[data-cy=deal-list-view-rating] > #rate-deal-down");
const getDealViewPrice = () => cy.get("[data-cy=deal-list-view-price]");
const getDealViewPostageCost = () =>
  cy.get("[data-cy=deal-list-view-postage-cost]");
const getDealViewImage = () => cy.get("[data-cy=deal-list-view-image]");
const getDealViewUserName = () => cy.get("[data-cy=deal-list-view-user] > p");
const getDealViewUserProfilePicture = () =>
  cy.get("[data-cy=deal-list-view-user] > img");
const getDealViewCreatedDate = () =>
  cy.get("[data-cy=deal-list-view-posted-date]");
const getDealViewExpirationDate = () =>
  cy.get("[data-cy=deal-list-view-expiration-date]");
const getDealViewCommentTotal = () =>
  cy.get("[data-cy=deal-list-view-comments-total]");
const getDealViewGetDealBtn = () => cy.get("[data-cy=deal-list-view-get-deal]");

const loginUser = (username, password) => {
  cy.intercept("POST", "api/log_in").as("logIn");

  cy.visit("");
  cy.get(navLoginRegisterBtn).click();
  cy.get("[data-cy=login-username]").type(username);
  cy.get("[data-cy=login-password]").type(password);
  cy.get(loginModalBtn).click();
  cy.wait("@logIn");
  cy.get("[data-cy=login-modal-background]").should("not.exist");
  cy.get("[data-cy=login-modal-main]").should("not.exist");
};

describe("Deal list view displays correct information", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Deal with no expiration date, no price and no postage cost displays correct data", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.visit("");
    getDealViewTitle(this.dealOne.title).should(
      "have.text",
      this.dealOne.title
    );
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewPrice().should("not.exist");
    getDealViewPostageCost().should("not.exist");
    getDealViewImage()
      .should("have.attr", "src")
      .should("include", this.dealOne.image);
    getDealViewUserName().contains(this.dealOne.user.username);
    getDealViewUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.dealOne.user.profile_picture);
    getDealViewCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.dealOne.created)}`
    );
    getDealViewExpirationDate().should("not.exist");
    getDealViewCommentTotal().should("have.text", this.dealOne.total_comments);
    getDealViewGetDealBtn()
      .should("have.attr", "href")
      .should("include", `${this.dealOne.url}`);
  });

  it("Deal with expiration date, price and postage cost displays correct data", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealTwo],
    });

    cy.visit("");
    getDealViewTitle(this.dealTwo.title).should(
      "have.text",
      this.dealTwo.title
    );
    getDealViewRating().should("have.text", this.dealTwo.rating);
    getDealViewPrice().should("have.text", `£ ${this.dealTwo.price}`);
    getDealViewPostageCost().should(
      "have.text",
      `£ ${this.dealTwo.postage_cost}`
    );
    getDealViewImage()
      .should("have.attr", "src")
      .should("include", this.dealTwo.image);
    getDealViewUserName().contains(this.dealTwo.user.username);
    getDealViewUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.dealTwo.user.profile_picture);
    getDealViewCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.dealTwo.created)}`
    );
    getDealViewExpirationDate().should(
      "have.text",
      `Expires ${new Date(this.dealTwo.deal_end_date).toLocaleDateString(
        "en-US"
      )}`
    );
    getDealViewCommentTotal().should("have.text", this.dealTwo.total_comments);
    getDealViewGetDealBtn()
      .should("have.attr", "href")
      .should("include", `${this.dealTwo.url}`);
  });
});

describe("Deal list view click for specific deal view", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Can click deal title to view full deal", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.visit("");
    getDealViewTitle(this.dealOne.title).click();
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/deal/${this.dealOne.id}`
    );
  });

  it("Can click deal image to view full deal", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.visit("");
    getDealViewImage().click();
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/deal/${this.dealOne.id}`
    );
  });
});

describe("Deal list view rate functions", function () {
  beforeEach(function () {
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Authorised user can up vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +this.dealOne.rating + 1);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo up vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [
        {
          ...this.dealOne,
          rated_by_user: true,
          rating: +this.dealOne.rating + 1,
        },
      ],
    });
    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: null,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", +this.dealOne.rating + 1);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +this.dealOne.rating - 1);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo down vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [
        {
          ...this.dealOne,
          rating: +this.dealOne.rating - 1,
          rated_by_user: false,
        },
      ],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", +this.dealOne.rating - 1);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +this.dealOne.rating + 1);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote from up vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [
        {
          ...this.dealOne,
          rated_by_user: true,
          rating: +this.dealOne.rating + 1,
        },
      ],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", +this.dealOne.rating + 1);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +this.dealOne.rating - 1);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can up vote from down vote", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [
        {
          ...this.dealOne,
          rated_by_user: false,
          rating: +this.dealOne.rating - 1,
        },
      ],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(this.user.username, this.user.password);
    getDealViewRating().should("have.text", +this.dealOne.rating - 1);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +this.dealOne.rating + 1);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });

  it("Unauthorised user can't rate deals up", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.get("[data-cy=login-modal-background]").should("exist");
    cy.get("[data-cy=login-modal-main]").should("exist");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unauthorised user can't rate deals down", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit("");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.get("[data-cy=login-modal-background]").should("exist");
    cy.get("[data-cy=login-modal-main]").should("exist");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unauthorised user can't rate deals down", function () {
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: false,
        rating: +this.dealOne.rating - 1,
      },
    }).as("dealVote");

    cy.visit("");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.get("[data-cy=login-modal-background]").should("exist");
    cy.get("[data-cy=login-modal-main]").should("exist");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified user can't rate deals up", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
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

    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified user can't rate deals down", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");

    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");
    cy.visit("");
    loginUser(randomUsername, userPassword);

    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    getDealViewRating().should("have.text", this.dealOne.rating);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Unverified users can close unverified email modal", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");
    cy.intercept("GET", "/api/deals/", {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.intercept(`/api/deals/${this.dealOne.id}/vote/`, {
      deal: {
        ...this.dealOne,
        rated_by_user: true,
        rating: +this.dealOne.rating + 1,
      },
    }).as("dealVote");

    cy.visit("");
    loginUser(randomUsername, userPassword);
    getDealViewRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    cy.get("body").click(0, 0);
    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    cy.get("[data-cy=verify-email-modal-main]").should("not.exist");
    getDealViewRateDownIcon().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
    cy.get("[data-cy=verify-email-modal-main]").should("exist");
    cy.get("[data-cy=verify-email-modal-close-icon]").click();
    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    cy.get("[data-cy=verify-email-modal-main]").should("not.exist");
  });
});
