import createdAgoDateTime from "../../src/utils/createdAgoDateTime";
const ARROW_COLOUR =
  "invert(0.46) sepia(0.81) saturate(46.19) hue-rotate(187deg) brightness(0.96) contrast(0.93)";

const getDealViewTitle = () => cy.get("[data-cy=deal-list-view-details] > h2");
const getDealViewRating = () =>
  cy.get("[data-cy=deal-list-view-rating]").find("p");
const getDealViewRateUpIcon = () =>
  cy.get("[data-cy=deal-list-view-rating] > #rate-deal-up");
const getDealViewRateDownIcon = () =>
  cy.get("[data-cy=deal-list-view-rating] > #rate-deal-down");
const getDealViewPrice = () => cy.get("[data-cy=deal-list-view-price]");
const getDealViewImage = () => cy.get("[data-cy=deal-list-view-image]");
const getDealViewUserName = () =>
  cy.get("[data-cy=deal-list-view-user-details] > p");
const getDealViewUserProfilePicture = () =>
  cy.get("[data-cy=deal-list-view-user-details] > img");
const getDealViewCreatedDate = () =>
  cy.get("[data-cy=deal-list-view-date-created]");

const loginUser = (username, password) => {
  cy.intercept("POST", "api/log_in").as("logIn");
  cy.visit("");
  cy.get("[data-cy=nav-login-button]").click();
  cy.get("[data-cy=login-username]").type(username);
  cy.get("[data-cy=login-password]").type(password);
  cy.get("[data-cy=login-modal-button]").click();
  cy.wait("@logIn");
  cy.get("[data-cy=login-modal-background]").should("not.exist");
  cy.get("[data-cy=login-modal-main]").should("not.exist");
};

describe("Deal one displayed with correct data", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.stubDeals = stubDeals;
    });
  });

  it("Deal one has correct title", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1],
    });
    cy.visit("");

    getDealViewTitle().should("have.text", this.stubDeals.deal_1.title);
  });

  it("Deal one has correct rating", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewRating().contains(this.stubDeals.deal_1.rating);
  });

  it("Deal one does not have a price", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewPrice().should("not.exist");
  });

  it("Deal one has correct image", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewImage()
      .should("have.attr", "src")
      .should("include", this.stubDeals.deal_1.image);
  });

  it("Deal one has correct username", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewUserName().contains(this.stubDeals.deal_1.user.username);
  });

  it("Deal one has correct user profile picture", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.stubDeals.deal_1.user.profile_picture);
  });

  it("Deal one has correct posted date", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.stubDeals.deal_1.created)}`
    );
  });
});
describe("Deal two displayed with correct data", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.stubDeals = stubDeals;
    });
  });

  it("Deal two exists with correct title", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_2],
    });
    cy.visit("");

    getDealViewTitle().should("have.text", this.stubDeals.deal_2.title);
  });

  it("Deal two exists with correct price", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewPrice().should("have.text", `£${this.stubDeals.deal_2.price}`);
  });

  it("Deal two exists with correct rating", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewRating().contains(this.stubDeals.deal_2.rating);
  });

  it("Deal two exists with correct image", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewImage()
      .should("have.attr", "src")
      .should("include", this.stubDeals.deal_2.image);
  });

  it("Deal two exists with correct user username", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewUserName().contains(this.stubDeals.deal_2.user.username);
  });

  it("Deal two exists with correct user profile picture", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.stubDeals.deal_2.user.profile_picture);
  });

  it("Deal two exists with correct posted date", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1, this.stubDeals.deal_2],
    });

    getDealViewCreatedDate().should(
      "have.text",
      `Posted ${createdAgoDateTime(this.stubDeals.deal_2.created)}`
    );
  });
});
describe("Deal view on click", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.stubDeals = stubDeals;
    });
  });

  it("Can click deal title to view full deal", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1],
    });
    cy.visit("");

    getDealViewTitle().click();
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/deal/${this.stubDeals.deal_1.id}`
    );
  });

  it("Can click deal image to view full deal", function () {
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [this.stubDeals.deal_1],
    });
    cy.visit("");

    getDealViewImage().click();
    cy.url().should(
      "eq",
      `${Cypress.config().baseUrl}/deal/${this.stubDeals.deal_1.id}`
    );
  });
});

describe("Deal rate functions", function () {
  beforeEach(function () {
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.userData = userData;
    });
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.stubDeals = stubDeals;
    });
  });

  it("Authorised user can up vote", function () {
    const dealOne = this.stubDeals.deal_1;
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });
    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: true,
        rating: +dealOne.rating + 1,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +dealOne.rating + 1);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo up vote", function () {
    const dealOne = {
      ...this.stubDeals.deal_1,
      voted_by_user: true,
      rating: +this.stubDeals.deal_1.rating + 1,
    };
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });
    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: null,
        rating: +dealOne.rating - 1,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", `${+dealOne.rating - 1}`);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote", function () {
    const dealOne = this.stubDeals.deal_1;
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });

    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: false,
        rating: +dealOne.rating - 1,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +dealOne.rating - 1);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can undo down vote", function () {
    const dealOne = {
      ...this.stubDeals.deal_1,
      voted_by_user: false,
      rating: +this.stubDeals.deal_1.rating - 1,
    };
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });

    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: null,
        rating: +dealOne.rating + 1,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +dealOne.rating + 1);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can down vote from up vote", function () {
    const dealOne = {
      ...this.stubDeals.deal_1,
      voted_by_user: true,
      rating: +this.stubDeals.deal_1.rating + 1,
    };
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });

    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: false,
        rating: +dealOne.rating - 2,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +dealOne.rating - 2);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
  });

  it("Authorised user can up vote from down vote", function () {
    const dealOne = {
      ...this.stubDeals.deal_1,
      voted_by_user: false,
      rating: +this.stubDeals.deal_1.rating - 1,
    };
    cy.intercept("GET", "/api/deal/", {
      statusCode: 200,
      body: [dealOne],
    });

    cy.intercept(`/api/deal/${dealOne.id}/vote/`, {
      deal: {
        ...dealOne,
        voted_by_user: true,
        rating: +dealOne.rating + 2,
      },
    }).as("dealVote");

    loginUser(this.userData.username, this.userData.password);
    getDealViewRating().should("have.text", dealOne.rating);
    getDealViewRateUpIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateDownIcon().should("have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().click();
    cy.wait("@dealVote");
    getDealViewRating().should("have.text", +dealOne.rating + 2);
    getDealViewRateDownIcon().should("not.have.css", "filter", ARROW_COLOUR);
    getDealViewRateUpIcon().should("have.css", "filter", ARROW_COLOUR);
  });
});
