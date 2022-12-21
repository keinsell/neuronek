import { Command } from "../../../common/lib/domain/command";

export class GetUserProfileCommand extends Command {
	public readonly username: string;
	constructor(username: string) {
		super({});
		this.username = username;
	}
}
