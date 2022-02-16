describe("User view", function () {
  it("Can view user with all details", function () {
    const userName = "test";
    const dateJoined = new Date();
    const profilePicture = "default_image.jpg";
    const totalDealsPosted = 3;
    cy.intercept("GET", `/api/user/${userName}`, {
      body: {
        username: userName,
        profile_picture: profilePicture,
        total_deals_posted: totalDealsPosted,
        date_joined: dateJoined,
      },
    });

    cy.visit(`user/${userName}`);
    cy.get("p").contains(userName).should("have.text", userName);
    cy.get("p")
      .contains("Total deals posted:")
      .should("have.text", `Total deals posted: ${totalDealsPosted}`);
    cy.get("p")
      .contains("Member since:")
      .should("have.text", `Member since: ${dateJoined.toDateString("en-GB")}`);
    cy.get("p")
      .contains("Member since:")
      .should("have.text", `Member since: ${dateJoined.toDateString("en-GB")}`);
    cy.get("[data-cy=user-view-profile-picture]")
      .should("have.attr", "src")
      .should("include", profilePicture);
  });
});
