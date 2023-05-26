import { Exception } from './exception.js'

export class NotFound extends Exception {
	constructor(entity?: string) {
		super({
			statusCode: 404,
			message: `${entity || 'Entity'} was not found.`
		})
	}
}
