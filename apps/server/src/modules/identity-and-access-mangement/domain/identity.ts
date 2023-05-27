import { Account } from './entities/account'
import { AccountCreated } from './events/account-created/account-created.js'
import { UsernameChanged } from './events/username-changed/username-changed.js'
import { Username } from './value-objects/username/username.js'
import { AggregateRoot } from '~foundry/domain'

export class Identity extends AggregateRoot<Account> {
	constructor(public account: Account) {
		super(account)
	}

	create(): void {
		this.addEvent(new AccountCreated(this.account))
	}

	changeUsername(username: Username): void {
		this.account.changeUsername(username)
		this.addEvent(new UsernameChanged(this.account))
	}
}
