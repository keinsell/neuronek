import { AggregateRoot } from '../../../shared/core/domain/aggregate-root'
import { Account } from './entities/account'
import { AccountCreated } from './events/account-created/account-created.js'
import { UsernameChanged } from './events/username-changed.js'
import { Username } from './value-objects/username/username.js'

export class Identity extends AggregateRoot<Account> {
	constructor(public account: Account) {
		super(account)
	}

	changeUsername(username: Username): void {
		this.account.changeUsername(username)
		this.addEvent(new UsernameChanged(this.account))
	}

	create(): void {
		this.addEvent(new AccountCreated(this.account))
	}
}
