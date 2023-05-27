import { Account } from '../../entities/account.js'
import { DomainEvent } from '~foundry/domain'

export class UsernameChanged extends DomainEvent<Account> {
	constructor(public readonly account: Account) {
		super('account.username-changed', account)
	}
}
