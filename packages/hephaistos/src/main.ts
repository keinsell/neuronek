import { EffectRepository, PrismaClient, SubstanceRepository } from 'database'
import { Effect, ExperienceReport, Substance } from 'osiris'

import { EffectIndexEffectProvider } from './effect/provider/effectindex/effectindex.effect-provider.js'
import { PsychonautWikiSubstanceProvider } from './substance/provider/psychonautwiki/psychonautwiki.substance-provider.js'
import { DrugbankSubstanceProvider } from './substance/provider/drugbank/drugbank.substance-provider.js'

export class Hephaistos {
	substance_storage: Substance[]
	effect_storage: Effect[]
	experience_storage: ExperienceReport[]

	private constructor(dataset?: {
		substance_storage: Substance[]
		effect_storage: Effect[]
		experience_storage: ExperienceReport[]
	}) {
		this.substance_storage = dataset.substance_storage
		this.effect_storage = dataset.effect_storage
		this.experience_storage = dataset.experience_storage
	}

	static async build() {
		// Fetch and store all effects
		const effectindex = await new EffectIndexEffectProvider().load()
		const effects = [...effectindex]
		// Fetch and store all substances
		const psychonautwiki = await new PsychonautWikiSubstanceProvider().load()
		const drugbank = await new DrugbankSubstanceProvider().load()
		const substances = [...psychonautwiki, ...drugbank]

		return new Hephaistos({
			substance_storage: substances,
			effect_storage: effects,
			experience_storage: []
		})
	}

	/** Synchronize available information with database. */
	public async sync() {
		const prisma = new PrismaClient()
		await prisma.$connect()

		const substanceRepository = new SubstanceRepository(prisma)
		const effectRepository = new EffectRepository(prisma)

		for (const effect of this.effect_storage) {
			await effectRepository.save(effect)
		}

		console.log(`Saving ${this.substance_storage.length} substances...`)
		let substance_counter = 1
		for (const substance of this.substance_storage) {
			console.log(`Saving ${substance_counter}/${this.substance_storage.length}`)
			substance_counter++
			await substanceRepository.save(substance)
		}

		await prisma.$disconnect()
	}
}
