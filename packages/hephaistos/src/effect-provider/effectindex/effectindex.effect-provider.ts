import effectindex from 'effectindex-dataset'
import { Effect } from 'osiris'

import { EffectProviderAdapter } from '../effect-provider.adapter.js'

export class EffectIndexEffectProvider extends EffectProviderAdapter {
	async findByName(name: string): Promise<Effect> {
		const effect = effectindex.find((effect: { title: string }): boolean => effect.title === name)
		return new Effect({ name: effect.title })
	}

	async all(): Promise<Effect[]> {
		const effects: Effect[] = []

		for (const effect of effectindex) {
			const title = effect.title
			const summary = effect.description
			const raw_description = effect.text.split('\n')
			// Descroption sometimes contains an empty string and [1], [2] etc..., we should clean that up 🧻

			const description = []

			for (const line of raw_description) {
				if (line.startsWith('[')) continue
				if (line === '') continue

				description.push(line)
			}

			effects.push(new Effect({ name: title, summary: summary, description: description }))
		}

		return effects
	}
}
