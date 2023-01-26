import { Substance } from 'osiris'
import { findErowidExpericesWithOneOfCommonNamesMentioned } from './erowid/index.js'
import { getSubstanceFromPsychonautWiki } from './psychonautwiki/get-substance/get-substance.js'

export class HephaistosDataset {
	private readonly substance_store: Substance[] = []
	private readonly experiience_store: any[] = []
	private readonly effect_store: string[] = []

	constructor({ substances, experiences, effects }) {
		this.substance_store = substances
		this.experiience_store = experiences
		this.effect_store = effects
	}

	findSubstanceByName(substanceName: string): Substance {
		return this.substance_store.find(
			substance =>
				substance.name === substanceName ||
				substance.chemical_nomeclature.common_names.includes(substanceName) ||
				substance.chemical_nomeclature.substitutive_name === substanceName ||
				substance.chemical_nomeclature.systematic_name === substanceName
		)
	}
}

export class Hephaistos {
	private readonly substance_store: Substance[] = []
	private readonly experiience_store: any[] = []
	private readonly effect_store: string[] = []

	/** Method will use all available sources to provide dataset of available substances, effects and experiences. */
	public async build(): Promise<HephaistosDataset> {
		await this.buildSubstanceStore()
		await this.buildExperienceStore()
		await this.buildEffectStore()

		return new HephaistosDataset({
			substances: this.substance_store,
			experiences: this.experiience_store,
			effects: this.effect_store
		})
	}

	private async buildSubstanceStore() {
		this.substance_store.push(await getSubstanceFromPsychonautWiki('LSD'))
	}

	private async buildExperienceStore() {}
	private async buildEffectStore() {}
}

const dataset = await new Hephaistos().build()
console.log(dataset.findSubstanceByName('LSD'))
