import { Effect, ExperienceReport, Substance } from 'osiris'

import { EffectProviderAdapter } from './effect-provider/effect-provider.adapter.js'
import { EffectIndexEffectProvider } from './effect-provider/effectindex/effectindex.effect-provider.js'
import { ExperienceProviderAdapter } from './experience-provider/experience-provider.adapter.js'
import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'
import { SubstanceProviderAdapter } from './substance-provider/substance-provider.adapter.js'

export class Hephaistos {
	private readonly substance_store: Substance[] = []
	private readonly experience_store: ExperienceReport[] = []
	private readonly effect_store: Effect[] = []
	private substance_provider: SubstanceProviderAdapter
	private experience_provider: ExperienceProviderAdapter
	private effect_provider: EffectProviderAdapter

	/** Method will use all available sources to provide dataset of available substances, effects and experiences. */
	public async build(): Promise<void> {
		await this.buildEffectStore()
		await this.buildSubstanceStore()
		await this.buildExperienceStore()

		console.log(this.effect_store)
	}

	private async buildEffectStore() {
		const effectindex = await new EffectIndexEffectProvider().load()
		this.effect_store.push(...effectindex)
	}

	private async buildSubstanceStore() {
		const psychonautwiki = await new PsychonautWikiSubstanceProvider().load()
		this.substance_store.push(...psychonautwiki)
	}

	private async buildExperienceStore() {
		// const erowidExperiences = await new ErowidExperienceProvider().load()
		// this.experience_store.push(...erowidExperiences)
	}

	public save() {}
}
