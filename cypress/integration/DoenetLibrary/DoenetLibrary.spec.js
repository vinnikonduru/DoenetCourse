describe('DoenetLibrary tests', function () {

  beforeEach(() => {
    cy.fixture('libraryseed').then((seed) => {
      this.seed = seed;
      cy.request('POST', 'api/cypressCleanupLibrary.php', this.seed).then((response) => {
        cy.log(response);
        cy.request('POST', 'api/cypressSetupLibrary.php', this.seed).then((response) => {
          cy.log(response);
          cy.visit('http://localhost/library/#/')
        })
      })
    })
  })
  it('loaded successfully', function() {
    cy.visit('http://localhost/library/#/')
  });
})
