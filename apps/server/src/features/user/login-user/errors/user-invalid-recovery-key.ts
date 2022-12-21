import { ApplicationError } from "../../../../common/lib/domain/error";

export class UserInvalidRecoveryKeyError extends ApplicationError {
	constructor(message: string = "USER_INVALID_RECOVERY_KEY") {
		super(message, 403);
	}
}
