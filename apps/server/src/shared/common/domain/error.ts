interface DomainErrorProperties {
	message: string
	statusCode?: number
}

export class DomainError implements DomainErrorProperties {
	message: string
	statusCode?: number

	constructor(properites: DomainErrorProperties) {
		Object.assign(this, properites)
	}
}
