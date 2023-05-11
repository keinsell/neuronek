import { DomainEvent } from '../../../../../shared/core/domain/domain-event'
import { Account } from '../../entities/account'

export class AccountCreated extends DomainEvent<Account> {
	constructor(public readonly account: Account) {
		super(account)
	}

	public get name(): string {
		return 'account.created'
	}
}
