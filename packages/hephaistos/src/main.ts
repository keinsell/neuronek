import { Effect, ExperienceReport, Substance } from 'osiris'

import { PrismaDatabaseSync } from './database-sync/database-sync.adapter.js'
import { EffectIndexEffectProvider } from './effect-provider/effectindex/effectindex.effect-provider.js'
import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'

export class HephaistosDataset {
	public readonly substance_store: Substance[] = []
	public readonly experience_store: ExperienceReport[] = []
	public readonly effect_store: Effect[] = []
	private databaseSync = new PrismaDatabaseSync()

	constructor({ substances, experiences, effects }) {
		this.substance_store = substances
		this.experience_store = experiences
		this.effect_store = effects
	}

	public async sync() {
		await this.databaseSync.sync(this)
	}
}

export class Hephaistos {
	private readonly substance_store: Substance[] = []
	private readonly experience_store: ExperienceReport[] = []
	private readonly effect_store: Effect[] = []

	/** Method will use all available sources to provide dataset of available substances, effects and experiences. */
	public async build(): Promise<HephaistosDataset> {
		await this.buildEffectStore()
		await this.buildSubstanceStore()
		await this.buildExperienceStore()

		const dataset = new HephaistosDataset({
			substances: this.substance_store,
			experiences: this.experience_store,
			effects: this.effect_store
		})

		return dataset
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
}
