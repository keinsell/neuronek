import { SubstanceRepository } from 'database'
import { Service } from 'diod'
import { ok, Result } from 'neverthrow'
import { Substance } from 'osiris'

import { Usecase } from '../../../shared/common/domain/usecase.js'
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.js'

@Service()
export class DumpSubstancesService implements Usecase<never, Substance[], never> {
	private substanceRepository: SubstanceRepository

	constructor(private prismaService: PrismaService) {
		this.substanceRepository = new SubstanceRepository(prismaService)
	}

	async execute(): Promise<Result<Substance[], never>> {
		const all = await this.substanceRepository.findAll()
		return ok(all)
	}
}
