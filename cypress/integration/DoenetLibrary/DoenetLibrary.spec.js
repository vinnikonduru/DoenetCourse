describe('DoenetLibrary tests', function () {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  Cypress.Commands.add("clearThenType", { prevSubject: true }, (subject, text) => {
    cy.wrap(subject).clear().type(text);
  }
);
  beforeEach(() => {
    // cy.visit('/library')

    //  cy.fixture('libraryseed').then((seed) => {
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
    // cy.get('[data-cy=createNewCourse]').click();
//     cy.wait(500)
//     cy.get('[data-cy=driveCard0]').click();
     
//     cy.get('[data-cy=coursenameInput]')
//     .should('have.value','Untitled');

//     // cy.get('[data-cy=coursenameInput]').type();
//     // cy.get('[data-cy=coursenameInput]').type('test123');
//     //  cy.get('input[value="Untitled"]').should('have.value','Untitled')

//     cy.get('[data-cy=coursenameInput]').first()
//     .invoke('attr', 'value', 'Test name')
//     .clearThenType('Test name')
//     .should('have.attr', 'value', 'Test name')

    
//     cy.get('[data-cy=driveCard0]').dblclick();
//     cy.get('[data-cy=addFolder]').click();
//     cy.get('[data-cy=addDoenetML]').click();
//     cy.get('[data-cy=mainPanelStyle]').find('[data-cy=directFolderClick]').first().click();

// //Rename folder

//       cy.get('[data-cy=mainPanelStyle]').find('[data-cy=directFolderClick]').first().invoke('attr','data-doenet-driveinstanceid')
//     .then((itemTitle) => {
//       cy.get('[data-cy=folderNameInput]').first()
//     .invoke('attr', 'value', 'Test name')
//     .clearThenType('Test name')
//     .should('have.attr', 'value', 'Test name')
//     })

//     cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().click();
    
//   cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().invoke('attr','data-doenet-driveinstanceid')
//     .then((itemTitle) => {
//       cy.get('[data-cy=doenetMLInput]')
//     .invoke('attr', 'value', 'Test DoenetML')
//     .clearThenType('Test DoenetML')
//     .should('have.attr', 'value', 'Test DoenetML')

//     cy.get('[data-cy=mainPanelStyle]').find('[data-cy=doenetMLClick]').first().dblclick();

//     cy.get('.CodeMirror textarea')
//       .type('graph:<graph><point>(2,5)</point></graph>', { force: true })
  
//       cy.get('[data-cy=updateDoenetML]').click();
//       cy.get('[data-cy=saveVersion]').click();
//       cy.wait(100);
//       cy.get('[data-cy=vesrionHistoryClickTest]').first().click();
//       cy.get('[data-cy=returnToEdit]').click();

      

//       cy.get('[data-cy=closeOverlay]').click();
//       cy.get('[data-cy=driveCardsView]').click();


//       cy.get('[data-cy=createNewCourse]').click();
//       cy.get('[data-cy=createNewCourse]').click();
//       cy.get('[data-cy=createNewCourse]').click();
      
      // multiple selection
      // cy.get('.adiv').click({multple:true , shiftKey:true})


    // })

 


})

})
