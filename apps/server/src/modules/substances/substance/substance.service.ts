import { substanceRepository } from "./repositories/substance.repository";

export class SubstanceService {
  repository = substanceRepository;

  async findSubstanceByName(name: string) {
    const substance = await this.repository.findSubstanceByNameOrAlias(name);
    return substance;
  }
}

export const substanceService = new SubstanceService();
