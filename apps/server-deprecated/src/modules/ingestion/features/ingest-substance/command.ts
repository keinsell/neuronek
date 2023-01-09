import { Command } from "../../../../common/lib/domain/command";
import { User } from "../../../user/entity";
import { IngestSubstanceRequestDTO } from "./request";

export class IngestSubstanceCommand extends Command {
	public readonly user: User;
	public readonly request: IngestSubstanceRequestDTO;
	constructor(request: IngestSubstanceRequestDTO, user: User) {
		super({});
		this.user = user;
		this.request = request;
	}
}
