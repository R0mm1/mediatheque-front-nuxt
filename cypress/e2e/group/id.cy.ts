describe('#1 Page of a group', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('access_token', 'fake')
    cy.intercept(
      'POST',
      'http://auth.localhost/realms/mediatheque/protocol/openid-connect/userinfo',
      { fixture: 'auth/userinfo.json' }
    )

    cy.intercept('GET', 'http://api.localhost/reference_groups/1', {
      fixture: 'api/reference_groups/1.json'
    }).as('referenceGroup1')

    cy.visit('http://localhost/group/1')
  })

  it('#1-1 Display the right comment', () => {
    cy.wait('@referenceGroup1')
      .get('[data-cy="referenceGroupComment"]')
      .should('have.value', 'Groupe de test Cypress')
  })

  it('#1-2 Display the right books, and can remove one', () => {
    const trim = (string: String) => string.trim()

    cy
      // Wait for the group to be loaded
      .wait('@referenceGroup1')
      // Proxy the api calls that will be made during the deletion of the first element of the group
      .intercept('DELETE', 'http://api.localhost/reference_group_books/1edf9636-6d6b-6bce-a19d-63a6884b6b02', {
        statusCode: 204
      })
      .as('deleteFirstBookReference')
      .intercept('PUT', 'http://api.localhost/reference_groups/1/sort', {
        fixture: 'e2e/group/id/1-2-group_1_with_first_element_removed.json'
      })
      .as('sortGroup')
      .intercept('GET', 'http://api.localhost/reference_groups/1', {
        fixture: 'e2e/group/id/1-2-group_1_with_first_element_removed.json'
      }).as('referenceGroup1WithFirstElementRemoved')
      // Check the list contains the expected elements
      .get('[data-cy="listBooks"] [data-cy="listRow"]')
      .should('have.length', 2)
      .then((rows) => {
        cy.wrap(rows[0])
          .then(row => cy.wrap(row)
            .find('[data-cy="rowContent"]')
            .invoke('text')
            .then(trim)
            .should('eq', '1 Là où chantent les écrevisses')
            .then(() => row)
          )
          .find('[data-cy="rowButton"]')
          .should('have.length', 2)

        cy.wrap(rows[1])
          .then(row => cy.wrap(row)
            .find('[data-cy="rowContent"]')
            .invoke('text')
            .then(trim)
            .should('eq', '2 L\'inconnue de la crique')
            .then(() => row)
          )
          .find('[data-cy="rowButton"]')
          .should('have.length', 2)
      })
      // Remove the first element
      .get('[data-cy="listBooks"] [data-cy="listRow"] [data-cy="rowButton"]')
      .first()
      .click()
      .get('[data-cy="popupBookDelete"] [data-cy="popupBody"]')
      .then(popupBody => cy.wrap(popupBody)
        .invoke('text')
        .then(trim)
        .should('eq', 'Voulez-vous vraiment enlever le livre "Là où chantent les écrevisses" du groupe "Groupe de test Cypress"? Cette action est définitive.')
      )
      .get('[data-cy="popupBookDelete"] [data-cy="buttonRemove"]')
      .click()
      .wait('@deleteFirstBookReference')
      .wait('@sortGroup')
      .wait('@referenceGroup1WithFirstElementRemoved')
      .get('[data-cy="popupBookDelete"]')
      .should('have.length', 0)
      // Check the list has only one element left and check it's the expected one
      .get('[data-cy="listBooks"] [data-cy="listRow"]')
      .should('have.length', 1)
      .get('[data-cy="listBooks"] [data-cy="listRow"] [data-cy="rowContent"]')
      .then(rowContent => cy.wrap(rowContent)
        .invoke('text')
        .then(trim)
        .should('eq', '1 L\'inconnue de la crique')
      )
  })
})
