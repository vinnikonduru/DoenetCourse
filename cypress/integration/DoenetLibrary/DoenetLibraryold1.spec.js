Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
Cypress.Commands.add("clearThenType", { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).clear().type(text);
}
);

describe('DoenetLibrary tests', function () {

  /*
  1. Check if courses and content creates properly with title change and content creation
  2. Check Drag and Drop files and selections  
  */
  beforeEach(() => {
    // signed in as devuser
    cy.visit('http://localhost')
    cy.get('[data-cy=profileMenuButton]').click()
    cy.get('[data-cy=signinasdevuser7]').click()
    cy.get('[data-cy=profileMenuButton]').click()
    cy.get('[data-cy=signinasdevuser2]').click()
    
    cy.fixture('libraryseed').then((seed) => {
      this.seed = seed;
      cy.request('POST', 'api/cypressCleanupLibrary.php', this.seed).then((response) => {
        cy.log(response);
        cy.request('POST', 'api/cypressSetupLibrary.php', this.seed).then((response) => {
          cy.log(response);
        })
      })
    })
  })
 
  it('create new course', function() {
    // Course should be selected when clicked
    cy.get('[data-cy=createNewCourse]').click();
    cy.wait(500)
    // Edit selected course name
    cy.get('[data-cy=driveCard0]').click(); 
    cy.get('[data-cy=coursenameInput]')
    .should('have.value','Untitled');

    // cy.get('[data-cy=coursenameInput]').type();
    // cy.get('[data-cy=coursenameInput]').type('test123');
    //  cy.get('input[value="Untitled"]').should('have.value','Untitled')

    cy.get('[data-cy=coursenameInput]').first()
    .invoke('attr', 'value', 'Test name')
    .clearThenType('Test name')
    .should('have.attr', 'value', 'Test name')

    
    cy.get('[data-cy=driveCard0]').dblclick();
    cy.get('[data-cy=addFolder]').click();
    cy.get('[data-cy=addDoenetML]').click();
    cy.get('[data-cy=mainPanelStyle]').find('[data-cy=directFolderClick]').first().click();

// //Rename folder

      cy.get('[data-cy=mainPanelStyle]').find('[data-cy=directFolderClick]').first().invoke('attr','data-doenet-driveinstanceid')
    .then((itemTitle) => {
      cy.get('[data-cy=folderNameInput]').first()
    .invoke('attr', 'value', 'Test name')
    .clearThenType('Test name')
    .should('have.attr', 'value', 'Test name')
    })

    cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().click();
    
  cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().invoke('attr','data-doenet-driveinstanceid')
    .then((itemTitle) => {
      cy.get('[data-cy=doenetMLInput]')
    .invoke('attr', 'value', 'Test DoenetML')
    .clearThenType('Test DoenetML')
    .should('have.attr', 'value', 'Test DoenetML')

    cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().dblclick();

    cy.get('.CodeMirror textarea')
      .type('graph:<graph><point>(2,5)</point></graph>', { force: true })
  
      cy.get('[data-cy=updateDoenetML]').click();
      cy.get('[data-cy=saveVersion]').click();
      cy.wait(100);
      cy.get('[data-cy=vesrionHistoryClickTest]').first().click();
      cy.get('[data-cy=returnToEdit]').click();

      

      cy.get('[data-cy=closeOverlay]').click();
      cy.get('[data-cy=driveCardsView]').click();


    })
})

})
