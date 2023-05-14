import { Command } from '../../../../../shared/core/cqrs/command/command'

interface DefineAuthorizationChallengeProperties {
	username: string
}

export class DefineAuthorizationChallenge extends Command implements DefineAuthorizationChallengeProperties {
	public username: string

	constructor(payload: DefineAuthorizationChallengeProperties) {
		super()
		Object.assign(this, payload)
	}
}
