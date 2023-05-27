import { Account } from '../../domain/entities/account.js'
import { AccountCreatedHandler } from '../../domain/events/account-created/account-created-handler.js'
import { AccountCreated } from '../../domain/events/account-created/account-created.js'
import { InMemoryDomainBus } from '~components/domain-bus/index.js'

export class IdentityAndAccessDomainBus extends InMemoryDomainBus<Account> {
	constructor() {
		super()
		this.subscribe(AccountCreated, new AccountCreatedHandler())
	}
}
