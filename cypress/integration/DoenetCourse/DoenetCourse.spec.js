
describe('Assignment creation in course', function () {
    beforeEach(() => {
      cy.visit('/signin');
      cy.visit('/course');
      cy.wait(500);
    });


  it('Creating a new assignment by clicking the make assignment button', function() {
    cy.wait(1000)
    let courseDriveCardLabel = "";
    const driveCard = cy.get('[data-cy=driveCard]').first();
    driveCard.within(() => {
      cy.get('[data-cy=driveCardLabel]').invoke('text').then(driveLabel => {
        courseDriveCardLabel = driveLabel;
      })
    });
    driveCard.dblclick();

    cy.get(':nth-child(1) > :nth-child(1) > [data-cy=navDriveHeader]').should('exist');
    
    cy.get('[data-cy=navPanel]').within(() => {
      cy.get('[data-cy=navDriveHeader]').should('exist').click();
    });
      cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');

        cy.get('[data-cy=doenetMLIcon]').should('exist');
        const doenetML = cy.get('[data-cy=driveItem]').first();
        doenetML.invoke('attr', 'data-cy', 'doenetMLItem')
        doenetML.click();
         });
         
         cy.wait(2000);
         cy.get("body").then(($body) => {
          // if ($body.find("[data-cy=viewContentButton]").length) {
          //   cy.get('[data-cy=viewContentButton]').click();
          //  }
          if ($body.find("[data-cy=createNewAssignmentButton]").length) {
            cy.get('[data-cy=createNewAssignmentButton]').click();
           } 
        })
})


it('Publish content type doenetMl', function() {
  let courseDriveCardLabel = "";
  const driveCard = cy.get('[data-cy=driveCard]').first();
  driveCard.within(() => {
    cy.get('[data-cy=driveCardLabel]').invoke('text').then(driveLabel => {
      courseDriveCardLabel = driveLabel;
    })
  });
  driveCard.dblclick();

  cy.get(':nth-child(1) > :nth-child(1) > [data-cy=navDriveHeader]').should('exist');
  
  cy.get('[data-cy=navPanel]').within(() => {
    cy.get('[data-cy=navDriveHeader]').should('exist').click();
  });
    cy.get('[data-cy=mainPanel]').within(() => {
    cy.get('[data-cy=driveItem]').first().should('exist');

      cy.get('[data-cy=doenetMLIcon]').should('exist');
      const doenetML = cy.get('[data-cy=driveItem]').first();
      doenetML.invoke('attr', 'data-cy', 'doenetMLItem')
      doenetML.click();
       });
       cy.get("body").then(($body) => {
         if ($body.find("[data-cy=publishContentButton]").length) {
       cy.get('[data-cy=publishContentButton]').click();
          } 
                
        })
})

it('Update assignment settings and publish,make content, load assignment', function() {
  let courseDriveCardLabel = "";
  let newAssignmentNameLabel = "Test assignment label"
  const driveCard = cy.get('[data-cy=driveCard]').first();
  driveCard.within(() => {
    cy.get('[data-cy=driveCardLabel]').invoke('text').then(driveLabel => {
      courseDriveCardLabel = driveLabel;
    })
  });
  driveCard.dblclick();

  cy.get(':nth-child(1) > :nth-child(1) > [data-cy=navDriveHeader]').should('exist');
  
  cy.get('[data-cy=navPanel]').within(() => {
    cy.get('[data-cy=navDriveHeader]').should('exist').click();
  });
    cy.get('[data-cy=mainPanel]').within(() => {
    cy.get('[data-cy=driveItem]').first().should('exist');

      cy.get('[data-cy=doenetMLIcon]').should('exist');
      const doenetML = cy.get('[data-cy=driveItem]').first();
      doenetML.invoke('attr', 'data-cy', 'doenetMLItem')
      doenetML.click();
       });
       cy.wait(200);
       cy.get('[data-cy=assignmentNameInputValue]')
       .clear()
       .type(newAssignmentNameLabel)
       .type('{enter}');

       cy.get('[data-cy=publishAssignmentButton]').click();
       cy.wait(200);

       cy.get('[data-cy=makeContentButton]').click();
       cy.wait(200);
       cy.get('[data-cy=loadAssignmentButton]').click();
})


})
