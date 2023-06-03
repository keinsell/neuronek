import { InMemoryQueryBus }             from '~components/query-bus/index.js'
import { FindAccountByUsername }        from '../queries/get-account-by-username/find-account-by-username'
import { FindAccountByUsernameHandler } from '../queries/get-account-by-username/find-account-by-username.handler'



export class IdentityAndAccessQueryBus extends InMemoryQueryBus {
	constructor() {
		super()
		this.register(FindAccountByUsername, new FindAccountByUsernameHandler())
	}
}
