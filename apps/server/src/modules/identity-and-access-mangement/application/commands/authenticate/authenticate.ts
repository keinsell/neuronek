import { Command } from '../../../../../shared/core/cqrs/command/command.js'
import { Password } from '../../../domain/value-objects/password.js'
import { Username } from '../../../domain/value-objects/username/username.js'

interface AuthenticateProperties {
	password: Password
	username: Username
}

export class Authenticate extends Command implements AuthenticateProperties {
	password: Password
	username: Username

	constructor(payload: AuthenticateProperties) {
		super()
		this.password = payload.password
		this.username = payload.username
	}
}
