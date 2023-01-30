import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { ExperienceReport, Substance, SubstanceJSON } from 'osiris'

import { HephaistosDataset } from '../main.js'
import { Effect } from '../substance-provider/psychonautwiki/gql/sdk/graphql.js'

type CacheFileStructure = {
	substances: SubstanceJSON[]
	effects: any[]
	experiences: any[]
}

const adapter = new JSONFileSync<CacheFileStructure>('./cache.db.json')
const cacheManager = new LowSync<CacheFileStructure>(adapter)

export class CacheManager {
	protected db: LowSync<CacheFileStructure> = cacheManager

	cache(dataset: HephaistosDataset): void {
		this.db.read()

		if (!this.db.data) {
			this.db.data = {
				substances: [],
				effects: [],
				experiences: []
			}
		}

		this.db.data.substances = []
		this.db.data.experiences = []

		for (const substance of dataset.substance_store) {
			console.log(`Cache:Substance: "${substance.name}"`)
			const serializedSubstance = substance.toJSON()
			this.db.data.substances.push(serializedSubstance)
		}

		for (const experience of dataset.experience_store) {
			console.log(`Cache:Experience: "${experience.title}"`)
			const serializedExperience = experience.toJSON()
			this.db.data.experiences.push(serializedExperience)
		}

		this.db.write()
	}

	load(): {
		substances: Substance[]
		effects: Effect[]
		experiences: ExperienceReport[]
	} {
		this.db.read()

		if (!this.db.data) {
			return undefined
		}

		if (this.db.data.substances && this.db.data.substances.length < 5) {
			return undefined
		}

		console.log(`Cache:Substances: ${this.db.data.substances.length}`)
		console.log(`Cache:Experiences: ${this.db.data.experiences.length}`)

		return {
			substances: this.db.data.substances.map(substance => Substance.fromJSON(substance)),
			effects: this.db.data.effects,
			experiences: this.db.data.experiences.map(experience => ExperienceReport.fromJSON(experience))
		}
	}
}
