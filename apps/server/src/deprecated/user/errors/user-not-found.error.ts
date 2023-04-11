import { Exception } from '../../../shared/exception.js'

export class UserNotFoundError extends Exception {
	constructor() {
		super({
			message: 'User not found.',
			statusCode: 404
		})
	}
}
