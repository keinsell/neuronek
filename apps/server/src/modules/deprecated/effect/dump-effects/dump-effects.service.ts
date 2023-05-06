import { Service } from 'diod'
import { ok, Result } from 'neverthrow'
import { Effect } from 'osiris'

import { Usecase } from '../../../../shared/core/usecase.js'
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.js'

@Service()
export class DumpEffectsService implements Usecase<never, Effect[], never> {
	constructor(private prismaService: PrismaService) {}

	async execute(): Promise<Result<Effect[], never>> {
		// const effects = await this.effectRepsoitory.findAll()
		// return ok(effects)
		throw new Error('Method not implemented.')
	}
}
