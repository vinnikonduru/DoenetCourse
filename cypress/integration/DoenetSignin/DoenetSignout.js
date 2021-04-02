export const signOut = () => {
  
  
       cy.get('[data-cy=profileMenuButton]').click()
       cy.wait(500)
       cy.get('[data-cy=SignOut]').click()

}