interface ExceptionProperties {
	message: string
	statusCode?: number
}

export class Exception implements ExceptionProperties {
	message: string
	statusCode?: number

	constructor(properites: ExceptionProperties) {
		Object.assign(this, properites)
	}
}
