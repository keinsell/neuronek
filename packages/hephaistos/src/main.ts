import { ExperienceReport, Substance } from 'osiris'
import { PsychonautWikiSubstanceProvider } from './substance-provider/psychonautwiki/psychonautwiki.substance-provider.js'
import { CacheManager } from './cache-manager/cache.manager.js'

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
		console.log('Looking for substance ', substanceName)
		console.log(this.substance_store.map(substance => substance.name))

		return this.substance_store.find(
			substance =>
				(substance.name && substance.name === substanceName) ||
				substance.chemical_nomeclature?.common_names?.includes(substanceName) ||
				substance.chemical_nomeclature?.substitutive_name === substanceName ||
				substance.chemical_nomeclature?.systematic_name === substanceName
		)
	}
}

export class Hephaistos {
	private readonly substance_store: Substance[] = []
	private readonly experience_store: any[] = []
	private readonly effect_store: string[] = []
	private cacheManager: CacheManager = new CacheManager()
	private shouldUseCache: boolean = true

	/** Method will use all available sources to provide dataset of available substances, effects and experiences. */
	public async build(): Promise<HephaistosDataset> {
		// TODO: Find cached information from repository

		if (this.shouldUseCache) {
			const cache = this.cacheManager.load()

			if (cache) {
				this.substance_store.push(...cache.substances)
				console.log(`Loaded ${this.substance_store.length} substances from cache.`)
				return new HephaistosDataset({
					substances: this.substance_store,
					experiences: this.experience_store,
					effects: this.effect_store
				})
			}
		}

		// TODO: If cache was not found fetch new dataset using all providers
		await this.buildSubstanceStore()
		await this.buildExperienceStore()
		await this.buildEffectStore()

		// TODO: Save scrapped information in repository

		const dataset = new HephaistosDataset({
			substances: this.substance_store,
			experiences: this.experience_store,
			effects: this.effect_store
		})

		if (this.shouldUseCache) {
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
