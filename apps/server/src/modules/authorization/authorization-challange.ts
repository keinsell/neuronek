import { AggregateRoot } from '../../shared/core/domain/aggregate-root.js'
import { Entity } from '../../shared/core/domain/enity.js'
import { Account } from '../account/entities/account.js'

export class AuthorizationChallange extends AggregateRoot<Account> {
	public createNew(): Account {
		throw new Error('Method not implemented.')
	}
}
