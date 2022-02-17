describe("Deal search", function () {
  beforeEach(function () {
    cy.fixture("dealListStubData.json").then((stubDeals) => {
      this.dealOne = stubDeals.deal_1;
      this.dealTwo = stubDeals.deal_2;
    });
  });

  it("Deal displayed with matching title", function () {
    const dealTitle = this.dealOne.title.substr(0, 6);
    cy.intercept("GET", `/api/deals/?search=${dealTitle}`, {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.visit("");
    cy.get("[data-cy=nav-search-bar-input").type(dealTitle);
    cy.get("p").should("contain", dealTitle);
  });

  it("Deal displayed with matching title", function () {
    const dealDesc = this.dealOne.description.substr(0, 6);
    const dealTitle = this.dealOne.title.substr(0, 6);
    cy.intercept("GET", `/api/deals/?search=${dealDesc}`, {
      statusCode: 200,
      body: [this.dealOne],
    });

    cy.visit("");
    cy.get("[data-cy=nav-search-bar-input").type(dealTitle);
    cy.get("p").should("contain", dealTitle);
  });

  it("No matching deals found", function () {
    const dealTitle = "invalid-deal";
    cy.intercept("GET", `/api/deals/?search=${dealTitle}`, {
      statusCode: 200,
      body: [],
    });

    cy.visit("");
    cy.get("[data-cy=nav-search-bar-input").type(dealTitle);
    cy.get("[data-cy=nav-search-results").should("not.exist");
  });
});
