interface ExceptionProperties {
	message: string
	statusCode: number
}

export class Exception extends Error implements ExceptionProperties {
	statusCode: number

	protected constructor(properites: ExceptionProperties) {
		super(properites.message)
		this.statusCode = properites.statusCode
		this.name = this.constructor.name
	}
}
