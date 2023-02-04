import { Effect, ExperienceReport, Substance } from 'osiris'

import { EffectIndexEffectProvider } from './effect/provider/effectindex/effectindex.effect-provider.js'
import { PsychonautWikiSubstanceProvider } from './substance/provider/psychonautwiki/psychonautwiki.substance-provider.js'

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
		const substances = [...psychonautwiki]

		return new Hephaistos({
			substance_storage: substances,
			effect_storage: effects,
			experience_storage: []
		})
	}
}
