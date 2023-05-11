import { Entity } from '../../../../shared/core/domain/enity.js'
import { AccountCreated } from '../events/account-created'
import { UsernameChanged } from '../events/username-changed'
import { PublicKey } from '../value-objects/public-key.js'
import { Username } from '../value-objects/username.js'

export interface AccountProperties {
	publicKey: PublicKey
	username: Username
}

export class Account extends Entity implements AccountProperties {
	publicKey: PublicKey
	username: Username

	constructor(properties: AccountProperties, id?: string) {
		super(id)
		this.publicKey = properties.publicKey
		this.username = properties.username
	}

	create(): AccountCreated {
		return new AccountCreated(this)
	}

	changeUsername(username: Username): UsernameChanged {
		this.username = username
		return new UsernameChanged(this)
	}
}
