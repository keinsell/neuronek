import { PublicKey } from './value-objects/public-key.js'
import { Username } from './value-objects/username.js'

export interface AccountProperties {
	publicKey: PublicKey
	username: Username
}

export class Account implements AccountProperties {
	publicKey: PublicKey
	username: Username

	constructor(properties: AccountProperties) {
		this.publicKey = properties.publicKey
		this.username = properties.username
	}
}