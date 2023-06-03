import { DomainEvent } from '~foundry/domain'
import { Account }     from '../../entities/account.js'



export class UsernameChanged extends DomainEvent<Account> {
	constructor(public readonly account: Account) {
		super(account)
	}
}
