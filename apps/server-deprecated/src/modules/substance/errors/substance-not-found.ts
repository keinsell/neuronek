import { ApplicationError } from "../../../common/lib/domain/error";

export class SubstanceNotFoundError extends ApplicationError {
	constructor(message: string = "SUBSTANCE_NOT_FOUND") {
		super(message, 404);
	}
}
