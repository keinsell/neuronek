import { EffectRepository } from 'database'
import { Service } from 'diod'
import { ok, Result } from 'neverthrow'
import { Effect } from 'osiris'

import { Usecase } from '../../../shared/common/domain/usecase.js'
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.js'

@Service()
export class DumpEffectsService implements Usecase<never, Effect[], never> {
	private effectRepsoitory: EffectRepository

	constructor(private prismaService: PrismaService) {
		this.effectRepsoitory = new EffectRepository(prismaService)
	}

	async execute(): Promise<Result<Effect[], never>> {
		const effects = await this.effectRepsoitory.findAll()
		return ok(effects)
	}
}
