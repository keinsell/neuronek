import { Account as DatabaseModel } from '@prisma/client'
import { Entity } from '../../../../shared/core/domain/enity'
import { AccountCreated } from '../events/account-created/account-created'
import { UsernameChanged } from '../events/username-changed'
import { PublicKey } from '../value-objects/public-key.js'
import { Username } from '../value-objects/username.js'

export class Account extends Entity implements Omit<DatabaseModel, 'id'> {
	publicKey: PublicKey
	username: Username

	constructor(properties: Omit<DatabaseModel, 'id'>, id?: string) {
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
