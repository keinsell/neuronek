import { Effect } from 'osiris'
import { LocalStorageRepository } from 'src/__core/localstorage.js'

interface EffectWriteReadModel {
	name: string
	slug?: string
	category?: string
	tags?: string[]
	summary?: string
	description?: string[]
	effectindex?: string
	psychonautwiki?: string
}

export class EffectLocalStorage extends LocalStorageRepository<Effect, EffectWriteReadModel> {
	constructor() {
		super('cache/effects.json')
	}

	toDomain(storage: EffectWriteReadModel): Effect {
		return new Effect({
			...storage
		})
	}

	toStorage(model: Effect): EffectWriteReadModel {
		return {
			...model
		}
	}

	async exists(model: Effect): Promise<boolean> {
		const find = this.low.data.find(effect => effect.name === model.name)

		return !!find
	}

	async getIndex(model: Effect): Promise<number> {
		const index = this.low.data.findIndex(effect => effect.name === model.name)

		if (index === -1) {
			return undefined
		}

		return index
	}
}
