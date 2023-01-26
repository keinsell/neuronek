import { DomainError } from '../../../shared/common/domain/error.js'

export class UsernameTakenError extends DomainError {
	constructor() {
		super({
			message: 'This username is already taken.',
			statusCode: 400
		})
	}
}
