import { DomainError } from '../../../shared/common/domain/error.js'

export class UserNotFoundError extends DomainError {
	constructor() {
		super({
			message: 'User not found.',
			statusCode: 404
		})
	}
}
