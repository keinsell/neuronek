import { ApplicationError } from ".";

export class ValidationError extends ApplicationError {
	constructor(message: string = "VALIDATION_ERROR") {
		super(message, 501);
	}
}
