import { AggregateRoot } from '../../../shared/core/domain/aggregate-root'
import { Account } from './entities/account'
import { Username } from './value-objects/username'

export class Identity extends AggregateRoot<Account> {
	changeUsername(username: Username): void {
		this.addEvent(this._entity.changeUsername(username))
	}

	// assignRole(): void {
	// 	throw new Error('Method not implemented.')
	// }
	//
	// removeRole(): void {
	// 	throw new Error('Method not implemented.')
	// }

	create(): void {
		this.addEvent(this._entity.create())
	}

	updatePublicKey(): void {
		throw new Error('Method not implemented.')
	}
}
