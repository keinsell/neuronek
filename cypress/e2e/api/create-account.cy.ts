const apiUrl = Cypress.env('apiGatewayUrl')
const username = Cypress.env('username')
const pgpKey = Cypress.env('pgpKey')

describe('create-account', () => {
	it('should create an account successfully', async () => {
		cy.request('POST', `${apiUrl}/account`, {
			username: username,
			publicKey: pgpKey
		})
			.its('status')
			.should('equal', 201)
	})
})
