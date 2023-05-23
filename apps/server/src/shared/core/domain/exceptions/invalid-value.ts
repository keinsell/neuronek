import { Exception } from '../exception.js'

export class InvalidValue extends Exception {
	constructor(message: string) {
		super({
			statusCode: 400,
			message: message
		})
	}
}
