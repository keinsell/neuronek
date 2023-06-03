import { Exception } from './exception.js'



export class NotImplemented extends Exception {
	constructor(feature: Function | Object) {
		super({
			statusCode: 501,
			message: `Feature ${
				feature instanceof Function ? feature.name : feature.constructor.name
			} is not implemented yet.`
		})
	}
}
