import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { ExperienceReport } from 'osiris'

export class ExperienceCacheManager {
	private adapter = new JSONFile<any[]>('./cache/experience.db.json')
	private db = new Low<any[]>(this.adapter)

	async all(): Promise<ExperienceReport[]> {
		await this.db.read()

		const effects: ExperienceReport[] = []

		if (!this.db.data) {
			return []
		}

		for (const effect of this.db.data) {
			effects.push(ExperienceReport.fromJSON(effect))
		}

		return effects
	}

	async save(effect: ExperienceReport): Promise<ExperienceReport> {
		await this.db.read()

		if (!this.db.data) {
			this.db.data = []
			await this.db.write()
		}

		const exists = this.db.data.find(x => x.name === effect.title)

		if (!exists) {
			this.db.data.push(effect.toJSON())
		}

		await this.db.write()

		return effect
	}

	async findByName(name: string): Promise<ExperienceReport | undefined> {
		await this.db.read()

		if (!this.db.data) {
			return undefined
		}

		return this.db.data.find(effect => effect.name === name)
	}
}
