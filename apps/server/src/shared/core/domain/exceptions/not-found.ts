import { Exception } from '../exception'

export class NotFound extends Exception {
	constructor(entity?: string) {
		super({
			statusCode: 404,
			message: `${entity || 'unknown'} was not found.`
		})
	}
}
