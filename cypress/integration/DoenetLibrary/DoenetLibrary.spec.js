describe('DoenetLibrary tests', function () {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  Cypress.Commands.add("clearThenType", { prevSubject: true }, (subject, text) => {
    cy.wrap(subject).clear().type(text);
  }
);
  beforeEach(() => {
   
     // cy.fixture('libraryseed').then((seed) => {
    //   this.seed = seed;
    //   cy.request('POST', 'api/cypressCleanupLibrary.php', this.seed).then((response) => {
    //     cy.log(response);
    //     cy.request('POST', 'api/cypressSetupLibrary.php', this.seed).then((response) => {
    //       cy.log(response);
    //       cy.visit('http://localhost/library/#/')
    //     })
    //   })
    // })
  })
  it('loaded successfully', function() {
    cy.visit('/library')
    cy.wait(500)
    cy.get('[data-cy=createNewCourse]').click();
    cy.wait(500)
    cy.get('[data-cy=driveCard0]').click();
     
    cy.get('[data-cy=coursenameInput]')
    .should('have.value','Untitled');

    // cy.get('[data-cy=coursenameInput]').type();
    // cy.get('[data-cy=coursenameInput]').type('test123');
    //  cy.get('input[value="Untitled"]').should('have.value','Untitled')

    cy.get('[data-cy=coursenameInput]')
    .invoke('attr', 'value', 'Test name')
    .clearThenType('Test name')
    .should('have.attr', 'value', 'Test name')

    
    cy.get('[data-cy=driveCard0]').dblclick();
    cy.get('[data-cy=addFolder').click();
    cy.get('[data-cy=addDoenetML').click();
  }


  )

})
