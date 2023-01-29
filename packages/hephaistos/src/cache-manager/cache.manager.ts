import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { HephaistosDataset } from '../main.js'
import { ExperienceReport, Substance } from 'osiris'
import { Effect } from '../substance-provider/psychonautwiki/gql/sdk/graphql.js'
import { SubstanceJSON } from 'osiris'

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
			console.log(`Cache: ${substance.name}`)
			const serializedSubstance = substance.toJSON()
			this.db.data.substances.push(serializedSubstance)
		}

		for (const experience of dataset.experience_store) {
			console.log(`Cache: ${experience.title}`)
			const serializedExperience = experience.toJSON()
			this.db.data.experiences.push(serializedExperience)
		}

		console.log(`DB: ${this.db.data.substances.length} substances`)

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

		return {
			substances: this.db.data.substances.map(substance => Substance.fromJSON(substance)),
			effects: this.db.data.effects,
			experiences: this.db.data.experiences.map(experience => ExperienceReport.fromJSON(experience))
		}
	}
}
