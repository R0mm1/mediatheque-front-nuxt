describe('#1 Page "list of books"', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('access_token', 'fake')
    cy.intercept(
      'POST',
      'http://auth.localhost/realms/mediatheque/protocol/openid-connect/userinfo',
      { fixture: 'auth/userinfo.json' }
    )
    cy
      .intercept('GET', 'http://api.localhost/books?*', { fixture: 'api/books/list.json' })
      .as('listBooks')
    cy.intercept(
      'GET',
      'http://api.localhost/user_configurations?name=list_book_default',
      { fixture: 'api/user_configurations/list_name_list_book_default.json' }
    )
    cy.intercept('GET', 'http://api.localhost/users', { fixture: 'api/users/list.json' })
    cy.visit('http://localhost/book')
  })

  it('#1-1 Display the right columns', () => {
    cy.get('[data-cy="listRow"]')
      .should('have.length', 3)
      .then((rows) => {
        cy.wrap(rows[0]).find('[data-cy="cell"]')
          .should('have.length', 4)
          .then((cells) => {
            expect(cells[0]).to.contain('Bouddha')
            expect(cells[1]).to.contain('2003')
            expect(cells[2]).to.contain('Français')
            expect(cells[3]).to.contain('Clive Cussler, Craig Dirgo')
          })

        cy.wrap(rows[1]).find('[data-cy="cell"]')
          .should('have.length', 4)
          .then((cells) => {
            expect(cells[0]).to.contain('Là où chantent les écrevisses')
            expect(cells[1]).to.contain('2018')
            expect(cells[2]).to.contain('Français')
            expect(cells[3]).to.contain('Delia Owens')
          })

        cy.wrap(rows[2]).find('[data-cy="cell"]')
          .should('have.length', 4)
          .then((cells) => {
            expect(cells[0]).to.contain('L\'inconnue de la crique')
            expect(cells[1]).to.contain('1999')
            expect(cells[2]).to.contain('Français')
            expect(cells[3]).to.contain('Martha Grimes')
          })
      })
  })

  it('#1-2 Display the right headers', () => {
    cy.get('[data-cy="headerRowLabel"]')
      .should('have.length', 4)
      .then((headerRowLabels) => {
        expect(headerRowLabels[0]).to.contain('Titre')
        expect(headerRowLabels[1]).to.contain('Année')
        expect(headerRowLabels[2]).to.contain('Langue')
        expect(headerRowLabels[3]).to.contain('Auteur')
      })
  })

  it('#1-3 Can change the displayed columns', () => {
    cy
      .intercept(
        'GET',
        'http://api.localhost/user_configurations?name=list_book_default',
        { fixture: 'e2e/book/index/1-3-list_user_configurations.json' }
      )
      .as('listUserConfigurations')

    cy
      .wait('@listBooks')
      .wait('@listUserConfigurations')
      .get('[data-cy="leftActionBarElement"]')
      .contains('Colonne')
      .parents('[data-cy="leftActionBarElement"]')
      .click()
      .get('[data-cy="listColumnSelectionPopupCheckbox"]')
      .should('have.length', 4)
      .then((checkboxs) => {
        cy.wrap(checkboxs[0]).find('label').contains('Titre')
        cy.wrap(checkboxs[1]).find('label').contains('Année')
        cy.wrap(checkboxs[2])
          .find('label')
          .contains('Langue')
          .click()
        cy.wrap(checkboxs[3])
          .find('label')
          .contains('Auteur')
          .click()
      })
      .get('[data-cy="headerRowLabel"]')
      .should('have.length', 2)
      .then((headerRowLabels) => {
        expect(headerRowLabels[0]).to.contain('Titre')
        expect(headerRowLabels[1]).to.contain('Langue')
      })
      .get('[data-cy="listColumnSelectionPopup"] [data-cy="select"]')
      .click()
      .get('[data-cy="listColumnSelectionPopup"]')
      .should('not.exist')
  })
})
