describe('Google Search', function() {
  it('Cypress.json', function() {
    cy
    .log(Cypress.config())
    .visit('search?q=cypress')
    expect(1).to.eq(1) 
  })
})
