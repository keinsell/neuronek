import { Exception } from '../exception.js'

export class IdentifierMissing extends Exception {
	constructor(entity?: string) {
		super({
			statusCode: 404,
			message: `Identifier of ${entity || 'Unknown'} is missing. Perhaps system delayed write operation to database.`
		})
	}
}
