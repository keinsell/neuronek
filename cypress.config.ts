import { defineConfig } from 'cypress'
import { CYPRESS_PGP_KEY } from './cypress/utils/pgp-key'

const randomUsername = Math.random().toString(36).substring(7)

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		env: {
			username: randomUsername,
			pgpKey: CYPRESS_PGP_KEY,
			apiGatewayUrl: 'http://localhost:1337'
		}
	}
})
