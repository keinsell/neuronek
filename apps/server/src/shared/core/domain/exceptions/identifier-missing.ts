import { Exception } from '../exception.js'

export class IdentifierMissing extends Exception {
	constructor(entity?: string) {
		super({
			statusCode: 404,
			message: `Identifier of ${
				entity || 'Entity'
			} is missing. Perhaps system delayed write to database because high load in system, please try again or wait a little moment and check if your action has been made.`
		})
	}
}
