import { ApplicationError } from "../../../../../common/lib/domain/error";

export class UserNotAuthorizedError extends ApplicationError {
	constructor(message: string = "USER_NOT_AUTHORIZED") {
		super(message, 403);
	}
}
