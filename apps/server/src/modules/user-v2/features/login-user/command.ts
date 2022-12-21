import { Command } from "../../../../common/lib/domain/command";

export class LoginUserCommand extends Command {
	public readonly username: string;
	public readonly recoveryKey: string;
	constructor(payload: { username: string; recoveryKey: string }) {
		super({});
		this.username = payload.username;
		this.recoveryKey = payload.recoveryKey;
	}
}
