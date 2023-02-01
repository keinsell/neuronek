import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Substance } from 'osiris'

export class SubstanceCacheManager {
	private adapter = new JSONFile<any[]>('./cache/substance.db.json')
	private db = new Low<any[]>(this.adapter)

	async all(): Promise<Substance[]> {
		await this.db.read()

		const effects: Substance[] = []

		if (!this.db.data) {
			return []
		}

		for (const effect of this.db.data) {
			effects.push(Substance.fromJSON(effect))
		}

		return effects
	}

	async save(effect: Substance): Promise<Substance> {
		await this.db.read()

		if (!this.db.data) {
			this.db.data = []
			await this.db.write()
		}

		const exists = this.db.data.find(x => x.name === effect.name)

		if (!exists) {
			this.db.data.push(effect.toJSON())
		}

		await this.db.write()

		return effect
	}

	async findByName(name: string): Promise<Substance | undefined> {
		await this.db.read()

		if (!this.db.data) {
			return undefined
		}

		return this.db.data.find(effect => effect.name === name)
	}
}
