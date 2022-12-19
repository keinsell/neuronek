export class ApplicationError {
	public readonly message: string;
	public readonly statusCode: number;
	public readonly name: string;

	constructor(message: string, statusCode = 500) {
		this.message = message;
		this.statusCode = statusCode;
		this.name = this.constructor.name;
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.statusCode,
		};
	}
}
