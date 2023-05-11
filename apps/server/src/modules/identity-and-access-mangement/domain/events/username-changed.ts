import { DomainEvent } from '../../../../shared/core/domain/domain-event'
import { Account } from '../entities/account'

export class UsernameChanged extends DomainEvent<Account> {
	constructor(public readonly account: Account) {
		super(account)
	}

	public eventName(): string {
		return 'account.username-changed'
	}
}
