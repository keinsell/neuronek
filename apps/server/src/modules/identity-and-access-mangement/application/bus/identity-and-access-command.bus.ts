import { InMemoryCommandBus }         from '~components/command-bus/index.js'
import { AccountWriteRepository }     from '../../infrastructure/repositories/account.write-repository.js'
import { CreateAccount }              from '../commands/create-account/create-account'
import { CreateAccountHandler }       from '../commands/create-account/create-account-handler'
import { IdentityAndAccessDomainBus } from './identity-and-access-domain-bus.js'



export class IdentityAndAccessCommandBus
	extends InMemoryCommandBus<CreateAccount> {
	constructor() {
		super()
		this.subscribe<CreateAccount>( CreateAccount, new CreateAccountHandler( new IdentityAndAccessDomainBus(), new AccountWriteRepository() ) )
	}
}
