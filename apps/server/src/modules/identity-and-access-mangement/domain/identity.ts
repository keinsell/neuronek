import { AggregateRoot } from '../../../shared/core/domain/aggregate-root'
import { Account } from './entities/account'
import { Username } from './value-objects/username'

export class Identity extends AggregateRoot<Account> {
	constructor(public account: Account) {
		super(account)
	}

	changeUsername(username: Username): void {
		this.addEvent(this.account.changeUsername(username))
	}

	// assignRole(): void {
	// 	throw new Error('Method not implemented.')
	// }
	//
	// removeRole(): void {
	// 	throw new Error('Method not implemented.')
	// }

	create(): void {
		this.addEvent(this.account.create())
	}

	updatePublicKey(): void {
		throw new Error('Method not implemented.')
	}
}
