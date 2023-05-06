import { Exception } from '../../../../shared/core/exception.js'

export class UsernameTakenError extends Exception {
	constructor() {
		super({
			message: 'This username is already taken.',
			statusCode: 400
		})
	}
}
