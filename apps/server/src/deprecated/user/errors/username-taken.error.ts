import { Exception } from '../../../shared/exception.js'

export class UsernameTakenError extends Exception {
	constructor() {
		super({
			message: 'This username is already taken.',
			statusCode: 400
		})
	}
}
