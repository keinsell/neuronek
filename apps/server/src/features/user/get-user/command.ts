import { Command } from "../../../common/lib/domain/command";
import { User } from "../../../modules/user-v2/entity";

export class GetUserProfileCommand extends Command {
	public readonly user: User;
	constructor(user: User) {
		super({});
		this.user = user;
	}
}
