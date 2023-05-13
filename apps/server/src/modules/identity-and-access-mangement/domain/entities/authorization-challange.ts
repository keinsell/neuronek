import { Entity } from '../../../../shared/core/domain/enity'
import { PgpMessage } from '../value-objects/pgp-message'

export interface AuthorizationChallengeProperties {
	accountId: string
	encryptedMessage: PgpMessage
}

export class AuthorizationChallenge extends Entity implements AuthorizationChallengeProperties {
	public accountId: string
	public encryptedMessage: PgpMessage

	constructor(properties: AuthorizationChallengeProperties, id?: string) {
		super(id)
		this.accountId = properties.accountId
		this.encryptedMessage = properties.encryptedMessage
	}
}
