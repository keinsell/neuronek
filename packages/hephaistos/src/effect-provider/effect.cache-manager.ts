import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Effect } from 'osiris'

export class EffectCacheManager {
	private adapter = new JSONFile<any[]>('./cache/effect.db.json')
	private db = new Low<any[]>(this.adapter)

	async all(): Promise<Effect[]> {
		await this.db.read()

		const effects: Effect[] = []

		if (!this.db.data) {
			return []
		}

		for (const effect of this.db.data) {
			effects.push(Effect.fromJSON(effect))
		}

		return effects
	}

	async save(effect: Effect): Promise<Effect> {
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

	async findByName(name: string): Promise<Effect | undefined> {
		await this.db.read()

		if (!this.db.data) {
			return undefined
		}

		const result = this.db.data.find(effect => effect.name === name)

		if (!result) {
			return undefined
		}

		return Effect.fromJSON(result)
	}
}
