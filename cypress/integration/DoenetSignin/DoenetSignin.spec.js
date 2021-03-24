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
  })
})