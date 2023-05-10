import { Command } from '../../../../shared/core/cqrs/command/command.js'

/**
 * CreateAccountProperties interface defines the properties required to create an account.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
interface CreateAccountProperties {
	publicKey: string
	username: string
}

/**
 * The CreateAccount command is used to create a new account. It extends the Command class.
 * @publicKey - The PGP public key for the account.
 * @username - The unique username for the account.
 */
export class CreateAccount extends Command implements CreateAccountProperties {
	public publicKey: string
	public username: string

	constructor(payload: CreateAccountProperties) {
		super()
		this.publicKey = payload.publicKey
		this.username = payload.username
	}
}
