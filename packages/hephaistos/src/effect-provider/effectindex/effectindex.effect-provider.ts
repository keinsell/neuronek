import effectindex, { ParsedPage } from 'effectindex-dataset'
import { Effect } from 'osiris'

import { EffectProviderAdapter } from '../effect-provider.adapter.js'

class EffectIndexMapper {
	static toDomain(effect: ParsedPage): Effect {
		const title = effect.title
		const summary = effect.description
		const raw_description = effect.text.split('\n')
		const url = effect.url
		const description = []

		for (const line of raw_description) {
			if (line.startsWith('[')) continue
			if (line === '') continue

			description.push(line)
		}
		return new Effect({ name: title, summary: summary, description: description, effectindex: url })
	}
}

export class EffectIndexEffectProvider extends EffectProviderAdapter {
	async findByName(name: string): Promise<Effect> {
		const effect = effectindex.find((effect: { title: string }): boolean => effect.title === name)

		return EffectIndexMapper.toDomain(effect)
	}

	async all(): Promise<Effect[]> {
		const effects: Effect[] = []

		for (const effect of effectindex) {
			effects.push(EffectIndexMapper.toDomain(effect))
		}

		return effects
	}
}
