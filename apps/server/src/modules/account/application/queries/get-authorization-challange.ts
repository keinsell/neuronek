import { Command } from '../../../../shared/core/cqrs/command/command'

interface GetAuthorizationChallengeProperties {
	username: string
}

export class DefineAuthorizationChallenge extends Command implements GetAuthorizationChallengeProperties {
	public username: string

	constructor(payload: GetAuthorizationChallengeProperties) {
		super()
		Object.assign(this, payload)
	}
}
