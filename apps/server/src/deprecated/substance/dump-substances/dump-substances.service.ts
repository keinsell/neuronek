// import { SubstanceRepository } from 'database'
import { Service } from 'diod'
import { ok, Result } from 'neverthrow'
import { Substance } from 'osiris'

import { Usecase } from '../../../shared/usecase.js'
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.js'

@Service()
export class DumpSubstancesService implements Usecase<never, Substance[], never> {
	// private substanceRepository: SubstanceRepository
	constructor(private prismaService: PrismaService) {}
	execute(): Promise<Result<Substance[], never>> {
		throw new Error('Method not implemented.')
	}
	// async execute(): Promise<Result<Substance[], never>> {
	// 	const all = await this.substanceRepository.findAll()
	// 	return ok(all)
	// }
}
