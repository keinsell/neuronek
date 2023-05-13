import { Entity } from '../../../../shared/core/domain/enity'

export interface SessionProperties {
	accountId: string
	authorizationChallengeId: string
	accessTokenId: string
	refreshTokenId: string
}

export class Session extends Entity implements SessionProperties {
	public accessTokenId: string
	public accountId: string
	public authorizationChallengeId: string
	public refreshTokenId: string

	constructor(properties: SessionProperties, id?: string) {
		super(id)
		this.accessTokenId = properties.accessTokenId
		this.accountId = properties.accountId
		this.authorizationChallengeId = properties.authorizationChallengeId
		this.refreshTokenId = properties.refreshTokenId
	}
}
