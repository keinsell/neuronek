import { ApplicationError } from "../../../common/error/error.common.js";

export class UsernameAlreadyTaken extends ApplicationError {
	constructor(username: string) {
		super(`Username ${username} is already taken by another user.`);
	}
}
