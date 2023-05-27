import { DomainEvent } from '../../../../../shared/@foundry/domain/domain-event.js'
import { Account } from '../../entities/account'

export class AccountCreated extends DomainEvent<Account> {
	constructor(public readonly account: Account) {
		super('account.created', account)
	}
}
