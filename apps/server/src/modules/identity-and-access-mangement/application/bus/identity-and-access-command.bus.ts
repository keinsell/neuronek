import { CreateAccount } from '../commands/create-account/create-account'
import { CreateAccountHandler } from '../commands/create-account/create-account-handler'
import { InMemoryCommandBus } from '~components/command-bus/index.js'

export class IdentityAndAccessCommandBus extends InMemoryCommandBus {
	constructor() {
		super()
		this.subscribe<CreateAccount>(CreateAccount, new CreateAccountHandler()).then(() =>
			console.log(`CreateAccountHandler`)
		)
	}
}
