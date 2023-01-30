import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import { ExperienceReport, Substance, SubstanceJSON } from 'osiris'

import { Effect } from '../substance-provider/psychonautwiki/gql/sdk/graphql.js'

type CacheFileStructure = {
	substances: SubstanceJSON[]
	effects: any[]
	experiences: any[]
}

export interface CacheIO {
	substance_store: Substance[]
	effect_store: Effect[]
	experience_store: ExperienceReport[]
}

export abstract class CacheDriver {
	abstract load(): Promise<CacheIO>
	abstract overwrite(data: CacheIO): Promise<void>
}

export class FileCacheDriver implements CacheDriver {
	private adapter = new JSONFileSync<CacheFileStructure>('./cache.db.json')
	private db = new LowSync<CacheFileStructure>(this.adapter)

	async load(): Promise<CacheIO> {
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
			substance_store: this.db.data.substances.map(substance => Substance.fromJSON(substance)),
			effect_store: this.db.data.effects,
			experience_store: this.db.data.experiences.map(experience => ExperienceReport.fromJSON(experience))
		}
	}

	async overwrite(dataset: CacheIO): Promise<void> {
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
}

export class PrismaCacheDriver implements CacheDriver {
	load(): Promise<CacheIO> {
		throw new Error('Method not implemented.')
	}
	overwrite(data: CacheIO): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
