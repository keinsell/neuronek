import { ExperienceReport, Substance } from 'osiris'

import { CacheManager } from './cache-manager/cache.manager.js'
import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'

export class HephaistosDataset {
	public readonly substance_store: Substance[] = []
	public readonly experience_store: ExperienceReport[] = []
	public readonly effect_store: string[] = []

	constructor({ substances, experiences, effects }) {
		this.substance_store = substances
		this.experience_store = experiences
		this.effect_store = effects
	}

	findSubstanceByName(substanceName: string): Substance {
		return this.substance_store.find(
			substance =>
				(substance.name && substance.name === substanceName) ||
				substance.nomenclature?.common_names?.includes(substanceName) ||
				substance.nomenclature?.substitutive_name === substanceName ||
				substance.nomenclature?.systematic_name === substanceName
		)
	}
}

export class Hephaistos {
	private readonly substance_store: Substance[] = []
	private readonly experience_store: any[] = []
	private readonly effect_store: string[] = []
	private cacheManager: CacheManager = new CacheManager()
	private restoreCache: boolean = false
	private saveCache: boolean = true

	/** Method will use all available sources to provide dataset of available substances, effects and experiences. */
	public async build(): Promise<HephaistosDataset> {
		if (this.restoreCache) {
			const cache = this.cacheManager.load()

			if (cache) {
				this.substance_store.push(...cache.substances)
				console.log(`Loaded ${this.substance_store.length} substances from cache.`)
				console.log(`Loaded ${this.experience_store.length} experiences from cache.`)
				return new HephaistosDataset({
					substances: this.substance_store,
					experiences: this.experience_store,
					effects: this.effect_store
				})
			}
		}

		await this.buildSubstanceStore()
		await this.buildExperienceStore()
		await this.buildEffectStore()

		const dataset = new HephaistosDataset({
			substances: this.substance_store,
			experiences: this.experience_store,
			effects: this.effect_store
		})

		if (this.saveCache) {
			this.cacheManager.cache(dataset)
		}

		return dataset
	}

	private async buildSubstanceStore() {
		const psychonautwiki = await new PsychonautWikiSubstanceProvider().all()
		this.substance_store.push(...psychonautwiki)
	}

	private async buildExperienceStore() {
		// const erowidExperiences = await new ErowidExperienceProvider().all()
		// this.experience_store.push(...erowidExperiences)
	}

	private async buildEffectStore() {}
}
