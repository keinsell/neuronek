import { InMemoryEventBus } from '../../../../shared/common/event-bus/in-memory-event-bus.js'
import { AccountCreated } from '../../domain/events/account-created/account-created'
import { AccountCreatedHandler } from '../../domain/events/account-created/account-created-handler'

export class IdentityAndAccessEventBus extends InMemoryEventBus {
	constructor() {
		super()
		this.subscribe(AccountCreated, new AccountCreatedHandler())
	}
}
