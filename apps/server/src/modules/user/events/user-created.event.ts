import { DomesticEvent } from "../../../common/event/event.common.js";
import { User } from "../entities/user.entity.js";

export class UserCreatedEvent extends DomesticEvent<User> {
	constructor(user: User) {
		super("USER_CREATED", user);
	}
}
