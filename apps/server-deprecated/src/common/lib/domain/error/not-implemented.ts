import { ApplicationError } from ".";

export class NotImplementedError extends ApplicationError {
	constructor(message: string = "") {
		super(message, 501);
	}
}
