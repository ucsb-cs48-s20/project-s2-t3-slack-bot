describe("Home Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit("http://localhost:3000");
  });

  it("has a nav bar", () => {
    // a nav element with class navbar
    cy.get("nav.navbar").should("exist");
  });

  it("has a addToSlack button that correctly links", () => {
    cy.get("a#add-to-SlackButton")
      .should("have.attr", "href")
      .and("include", "slack.com");
  });

  it("has a footer element and link to the source code is correct", () => {
    cy.get("a#footer")
      .should("have.attr", "href")
      .and(
        "include",
        "https://github.com/ucsb-cs48-s20/project-s2-t3-slack-bot"
      );
  });
});
