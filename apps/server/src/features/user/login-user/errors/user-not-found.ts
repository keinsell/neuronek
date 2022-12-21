import { ApplicationError } from "../../../../common/lib/domain/error";

export class UserNotFoundError extends ApplicationError {
	constructor(message: string = "USER_NOT_FOUND") {
		super(message, 404);
	}
}
