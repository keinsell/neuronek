import 'reflect-metadata'
import { Account } from './modules/identity-and-access-mangement/domain/entities/account.js'
import { Identity } from './modules/identity-and-access-mangement/domain/identity.js'
import { createPasswordHash } from './modules/identity-and-access-mangement/domain/value-objects/password-hash.js'
import { createUsername } from './modules/identity-and-access-mangement/domain/value-objects/username/username.js'

export { HttpApplication } from './interfaces/http/http.js'

new Identity(
	new Account({
		username: await createUsername('keinsell'),
		password: await createPasswordHash('asdsasddsad')
	})
)
