import { InMemoryDomainBus }     from '~components/domain-bus/index.js'
import { DomainEvent }           from '~foundry/domain'
import { Account }               from '../../domain/entities/account.js'
import { AccountCreatedHandler } from '../../domain/events/account-created/account-created-handler.js'
import { AccountCreated }        from '../../domain/events/account-created/account-created.js'



export class IdentityAndAccessDomainBus
	extends InMemoryDomainBus<DomainEvent<Account>> {
	constructor() {
		super()
		this.subscribe( AccountCreated, new AccountCreatedHandler() )
	}
}
