import { Exception } from '../exception.js'

export class InvalidCredentials extends Exception {
	constructor() {
		super({
			statusCode: 401,
			message: `Provided invalid credentials.`
		})
	}
}
