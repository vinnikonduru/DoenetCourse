// enter email on /signin to get signin code
// click button to get signin code
// get cookie device name

// new php request -- using emailid & device name
// return signin code
// enter password  and click signin
//goes to dashboard

describe('Sign in', () => {
  it('signin successfully', () => {
    cy.visit('/signin')

    cy.get('[data-cy=signinEmailInput]')
    // .invoke('attr','value',"devuser@example.com").blur()
    .type('devuser@example.com').blur()
      cy.get('[data-cy=sendEmailButton]').click()

      cy.request('POST','api/cypressSignin.php').then((response)=>{
       cy.log("response",response);
       cy.get('[data-cy=signinCodeInput]').type(response.body.signInCode)
       cy.get('[data-cy=signInButton]').click();


       // signout
       cy.get('[data-cy=profileMenuButton]').click()
       cy.wait(500)
       cy.get('[data-cy=SignOut]').click()
       cy.visit('/signin')
       cy.get('[data-cy=signinEmailInput]')
       // .invoke('attr','value',"devuser@example.com").blur()
       .type('devuser@example.com').blur()
         cy.get('[data-cy=sendEmailButton]').click()
   
         cy.request('POST','api/cypressSignin.php').then((response)=>{
          cy.log("response",response);
          cy.get('[data-cy=signinCodeInput]').type(response.body.signInCode)
          cy.get('[data-cy=signInButton]').click();
   
   
          // signout
          cy.get('[data-cy=profileMenuButton]').click()
          cy.wait(500)
          cy.get('[data-cy=SignOut]').click()
          
         })
      })

  })
})