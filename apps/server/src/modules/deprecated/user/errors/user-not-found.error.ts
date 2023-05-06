import { Exception } from '../../../../shared/core/exception.js'

export class UserNotFoundError extends Exception {
	constructor() {
		super({
			message: 'User not found.',
			statusCode: 404
		})
	}
}
