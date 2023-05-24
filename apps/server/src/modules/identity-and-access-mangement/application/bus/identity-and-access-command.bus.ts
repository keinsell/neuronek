import { InMemoryCommandBus } from '../../../../shared/common/command-bus/in-memory-command-bus.js'
import { CreateAccount } from '../commands/create-account/create-account'
import { CreateAccountHandler } from '../commands/create-account/create-account-handler'

export class IdentityAndAccessCommandBus extends InMemoryCommandBus {
	constructor() {
		super()
		this.registerHandler(CreateAccount, new CreateAccountHandler())
	}
}
