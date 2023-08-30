describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Tester Name',
      username: 'TesterUsername',
      password: 'TesterPassword'
    }

    const user2 = {
      name: 'Tester2 Name',
      username: 'Tester2Username',
      password: 'Tester2Password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user1)
    cy.request('POST', 'http://localhost:3003/api/users', user2)
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:5173')
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.visit('http://localhost:5173')
      cy.get('#username').type('TesterUsername')
      cy.get('#password').type('TesterPassword')
      cy.get('#loginButton').click()

      cy.contains('TesterUsername logged in')
    })

    it('fails with wrong credentials', function() {
      cy.visit('http://localhost:5173')
      cy.get('#username').type('TesterUsername')
      cy.get('#password').type('WrongPassword')
      cy.get('#loginButton').click()

      cy.contains('invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'TesterUsername', password: 'TesterPassword'})
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Cypress Test Blog')
      cy.get('#author').type('Cypress Test Author')
      cy.get('#url').type('www.cypresstestblog.com')
      cy.get('#createButton').click()

      cy.contains('New blog added')
      cy.contains('Cypress Test Blog')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {        
        cy.createBlog({
          title: 'Cypress Blog Title',
          author: 'Cypress Blog Author',
          url: 'www.cypresstestblog.com'
        })
      })

      it('can be liked', function() {
        cy.contains('view').click()
        cy.get('.likes').contains('likes 0')
        cy.get('.likeButton').click()
        cy.get('.likes').contains('likes 1')        
      })

      it('can be removed by creator', function() {
        cy.contains('Cypress Blog Title')
        cy.contains('view').click()
        cy.contains('remove').click()     
        cy.get('html').should('not.contain', 'Cypress Blog Title')
      })

      it('can not be removed by other users', function() {
        cy.login({username: 'Tester2Username', password: 'Tester2Password'})
        cy.contains('Cypress Blog Title')
        cy.contains('view').click()
        cy.contains('remove').should('not.be.visible')
      })

      it('blogs are shown in correct order according to like', function() {
        cy.createBlog({
          title: 'CypressBlog2',
          author:'CypressBlogger2',
          url: 'www.cypressblog2.com',
          likes: 20
        })

        cy.createBlog({
          title: 'CypressBlog3',
          author:'CypressBlogger3',
          url: 'www.cypressblog2.com',
          likes: 300
        })

        cy.contains('CypressBlog2').contains('view').click()
        cy.contains('CypressBlog2').contains('like').click()
        cy.contains('CypressBlog2').contains('hide').click()

        cy.contains('CypressBlog3').contains('view').click()
        cy.contains('CypressBlog3').contains('like').click()
        cy.contains('CypressBlog3').contains('hide').click()

        cy.contains('CypressBlog2').contains('view').click()
        cy.contains('CypressBlog2').contains('like').click()
        cy.contains('CypressBlog2').contains('hide').click()

        cy.get('.blog').eq(0).should('contain', 'CypressBlog2')
        cy.get('.blog').eq(1).should('contain', 'CypressBlog3')
        cy.get('.blog').eq(2).should('contain', 'Cypress Blog Title')
      })
    })
  })
})