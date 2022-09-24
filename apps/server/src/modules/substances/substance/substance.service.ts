import { substanceRepository } from "./repositories/substance.repository";

export class SubstanceService {
	repository = substanceRepository;

	async findSubstanceByName(name: string) {
		return await this.repository.findSubstanceByNameOrAlias(name);
	}
}

export const substanceService = new SubstanceService();
