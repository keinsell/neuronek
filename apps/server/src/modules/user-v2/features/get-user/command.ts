import { Command } from "../../../../common/lib/domain/command";
import { User } from "../../entity";

export class GetUserProfileCommand extends Command {
	public readonly user: User;
	constructor(user: User) {
		super({});
		this.user = user;
	}
}
