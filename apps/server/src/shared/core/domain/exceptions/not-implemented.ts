import { Exception } from '../exception.js'

export class NotImplemented extends Exception {
	constructor(featureName?: string) {
		super({
			statusCode: 500,
			message: `Feature ${featureName || 'unknown'} is not implemented yet.`
		})
	}
}
