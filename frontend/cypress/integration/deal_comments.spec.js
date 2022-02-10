import createdAgoDateTime from "../../src/utils/createdAgoDateTime";
const faker = require("faker");

const randomEmail = faker.internet.email();
const randomUsername = faker.internet.userName();
const userPassword = "password";
const LIKE_COLOUR =
  "invert(0.46) sepia(0.81) saturate(46.19) hue-rotate(187deg) brightness(0.96) contrast(0.93)";
const navLoginRegisterBtn = "[data-cy=nav-login-register-button]";
const loginModalBtn = "[data-cy=login-modal-button]";
const createAccBtn = "[data-cy=create-account-button]";
const sampleComment = "This is a test comment";

const getCommentUserProfilePicture = () =>
  cy.get("[data-cy=deal-view-comment-user-profile-picture]");
const getCommentUserUserName = () =>
  cy.get("[data-cy=deal-view-comment-user-username]");
const getCommentDate = () => cy.get("[data-cy=deal-view-comment-date]");
const getCommentText = () => cy.get("[data-cy=deal-view-comment-text]");
const getCommentLike = () => cy.get("[data-cy=deal-view-comment-like]");
const getCommentQuote = () => cy.get("[data-cy=deal-view-comment-quote]");
const getCommentTotalLikes = () =>
  cy.get("[data-cy=deal-view-comment-total-likes]");
const getCommentQuotedText = () =>
  cy.get("[data-cy=deal-view-comment-quoted-comment-text]");
const getCommentQuotedUser = () =>
  cy.get("[data-cy=deal-view-comment-quoted-comment-user]");

const getNewCommentTextArea = () =>
  cy.get("[data-cy=deal-view-new-comment-textarea]");
const getNewCommentSubmitBtn = () =>
  cy.get("[data-cy=deal-view-new-comment-submit-button]");

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

describe("Deal comment display", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
    });
    cy.fixture("commentStubData.json").then((stubComments) => {
      this.commentOne = stubComments.deal_1_comment_1;
      this.commentTwo = stubComments.deal_1_comment_2;
    });
  });

  it("Comment displays correct data with liked by user highlighted and no quoted comment ", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.visit(`deal/${this.dealOne.id}/`);

    getCommentUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.commentOne.user.profile_picture);
    getCommentUserUserName().should("have.text", this.commentOne.user.username);
    getCommentDate().should(
      "have.text",
      createdAgoDateTime(this.commentOne.created)
    );
    getCommentText().should("have.text", this.commentOne.text);
    getCommentLike().should("have.css", "filter", LIKE_COLOUR);
    getCommentQuote().should("exist");
    getCommentTotalLikes().should("have.text", this.commentOne.total_likes);
    getCommentQuotedText().should("not.exist");
    getCommentQuotedUser().should("not.exist");
  });

  it("Comment displays correct data with not liked user but with quoted comment ", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentTwo],
    }).as("comments");

    cy.visit(`deal/${this.dealOne.id}/`);

    getCommentUserProfilePicture()
      .should("have.attr", "src")
      .should("include", this.commentTwo.user.profile_picture);
    getCommentUserUserName().should("have.text", this.commentTwo.user.username);
    getCommentDate().should(
      "have.text",
      createdAgoDateTime(this.commentTwo.created)
    );
    getCommentText().should("have.text", this.commentTwo.text);
    getCommentLike().should("not.have.css", "filter", LIKE_COLOUR);
    getCommentQuote().should("exist");
    getCommentTotalLikes().should("have.text", this.commentTwo.total_likes);
    getCommentQuotedText().should(
      "have.text",
      this.commentTwo.quoted_comment_data.text
    );
    getCommentQuotedUser().should(
      "have.text",
      this.commentTwo.quoted_comment_data.user
    );
  });
});

describe("Deal comment functions", function () {
  beforeEach(function () {
    cy.fixture("verifiedUserData.json").then((userData) => {
      this.user = userData;
    });
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
    });
    cy.fixture("commentStubData.json").then((stubComments) => {
      this.commentOne = stubComments.deal_1_comment_1;
      this.commentTwo = stubComments.deal_1_comment_2;
    });
  });

  it("Can like comment", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentTwo],
    }).as("comments");

    cy.intercept("POST", `/api/deal_comment/${this.commentTwo.id}/like/`, {
      statusCode: 200,
      body: {
        ...this.commentTwo,
        liked_by_user: true,
        total_likes: +this.commentTwo.total_likes + 1,
      },
    }).as("like");

    cy.visit(`deal/${this.dealOne.id}/`);
    loginUser(this.user.username, this.user.password);

    getCommentLike().should("not.have.css", "filter", LIKE_COLOUR);
    getCommentTotalLikes().should("have.text", this.commentTwo.total_likes);
    getCommentLike().click();
    cy.wait("@like");
    getCommentLike().should("have.css", "filter", LIKE_COLOUR);
    getCommentTotalLikes().should(
      "have.text",
      +this.commentTwo.total_likes + 1
    );
  });

  it("Can unlike comment", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.intercept("POST", `/api/deal_comment/${this.commentOne.id}/like/`, {
      statusCode: 200,
      body: {
        ...this.commentOne,
        liked_by_user: false,
        total_likes: +this.commentOne.total_likes - 1,
      },
    }).as("like");

    cy.visit(`deal/${this.dealOne.id}/`);
    loginUser(this.user.username, this.user.password);

    getCommentLike().should("have.css", "filter", LIKE_COLOUR);
    getCommentTotalLikes().should("have.text", this.commentOne.total_likes);
    getCommentLike().click();
    cy.wait("@like");
    getCommentLike().should("not.have.css", "filter", LIKE_COLOUR);
    getCommentTotalLikes().should(
      "have.text",
      +this.commentOne.total_likes - 1
    );
  });

  it("Unauthorised user can't like", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.visit(`deal/${this.dealOne.id}/`);

    cy.get(loginModalBtn).should("not.exist");
    getCommentLike().click();
    cy.get(loginModalBtn).should("exist");
  });

  it("Unverified user can't like", function () {
    cy.intercept("POST", "api/sign_up").as("signUp");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

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

    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    getCommentLike().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
  });

  it("Can post new comment", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [],
    }).as("comments");
    cy.intercept("POST", `/api/deal_comment/`, {
      statusCode: 200,
      body: {
        ...this.commentTwo,
        quoted_comment_data: null,
        text: sampleComment,
      },
    }).as("newComment");

    cy.visit(`deal/${this.dealOne.id}/`);
    loginUser(this.user.username, this.user.password);
    getNewCommentTextArea().type(sampleComment);

    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [
        { ...this.commentTwo, quoted_comment_data: null, text: sampleComment },
      ],
    }).as("comments");

    getNewCommentSubmitBtn().click();
    cy.wait("@newComment");
    cy.wait("@comments");
    getCommentUserUserName().should("have.text", this.commentTwo.user.username);
    getCommentText().should("have.text", sampleComment);
  });

  it("Can post new comment with quote", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.intercept("POST", `/api/deal_comment/`, {
      statusCode: 200,
      body: {
        ...this.commentTwo,
        quoted_comment_data: null,
        text: sampleComment,
      },
    }).as("newComment");

    cy.visit(`deal/${this.dealOne.id}/`);
    loginUser(this.user.username, this.user.password);
    getCommentQuote().click();
    getNewCommentTextArea().type(sampleComment);

    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [{ ...this.commentTwo, text: sampleComment }],
    }).as("comments");

    getNewCommentSubmitBtn().click();
    cy.wait("@newComment");
    cy.wait("@comments");
    getCommentUserUserName().should("have.text", this.commentTwo.user.username);
    getCommentText().should("have.text", sampleComment);
    getCommentQuotedText().should("have.text", this.commentOne.text);
    getCommentQuotedUser().should("have.text", this.commentOne.user.username);
  });

  it("Unauthorised user can't post new comment", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.get(loginModalBtn).should("not.exist");
    getNewCommentSubmitBtn().click();
    cy.get(loginModalBtn).should("exist");
  });

  it("Unverified user can't post new comment", function () {
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/`, {
      statusCode: 200,
      body: this.dealOne,
    }).as("deal");
    cy.intercept("GET", `/api/deals/${this.dealOne.id}/comments/`, {
      statusCode: 200,
      body: [this.commentOne],
    }).as("comments");

    cy.visit(`deal/${this.dealOne.id}/`);
    loginUser(randomUsername, userPassword);

    cy.visit(`deal/${this.dealOne.id}/`);
    cy.get("[data-cy=verify-email-modal-background]").should("not.exist");
    getNewCommentSubmitBtn().click();
    cy.get("[data-cy=verify-email-modal-background]").should("exist");
  });
});
