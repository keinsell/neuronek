import { Exception } from '../exception.js'

export class PolicyViolation extends Exception {
	constructor(status: 403 | 422 | 409 | 400, policyName: string) {
		super({
			statusCode: status,
			message: `Action violated internal policy ${policyName}. Please try again with correct action.`
		})
	}
}
