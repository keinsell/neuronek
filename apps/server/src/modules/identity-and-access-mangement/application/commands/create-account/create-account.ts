import { Command } from '../../../../../shared/core/cqrs/command/command.js'
import { PublicKey } from '../../../domain/value-objects/public-key'
import { Username } from '../../../domain/value-objects/username'

/**
 * CreateAccountProperties interface defines the properties required to create an account.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
interface CreateAccountProperties {
	publicKey: PublicKey
	username: Username
}

/**
 * The CreateAccount command is used to create a new account. It extends the Command class.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
export class CreateAccount extends Command implements CreateAccountProperties {
	publicKey: PublicKey
	username: Username

	constructor(payload: CreateAccountProperties) {
		super()
		this.publicKey = payload.publicKey
		this.username = payload.username
	}
}
