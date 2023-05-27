import { Account } from '../../domain/entities/account.js'
import { AccountCreated } from '../../domain/events/account-created/account-created'
import { AccountCreatedHandler } from '../../domain/events/account-created/account-created-handler'
import { InMemoryDomainBus } from '~components/domain-bus/index.js'

export class IdentityAndAccessDomainBus extends InMemoryDomainBus<Account> {
	constructor() {
		super()
		this.subscribe(AccountCreated, new AccountCreatedHandler())
	}
}
