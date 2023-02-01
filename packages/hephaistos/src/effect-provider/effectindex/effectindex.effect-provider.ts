import effectindex, { ParsedPage } from 'effectindex-dataset'
import { Effect } from 'osiris'

import { EffectProviderAdapter } from '../effect-provider.adapter.js'
import { EffectCacheManager } from '../effect.cache-manager.js'

class EffectIndexMapper {
	static toDomain(effect: ParsedPage): Effect {
		let title = effect.title
		const summary = effect.description
		const raw_description = effect.text.split('\n')
		const url = effect.url
		const description = []

		// TODO: Move these mapping to effectindex-dataset package?

		title === 'An' ? (title = 'Epileptic seizure') : title
		title === 'Watery' ? (title = 'Watery eyes') : title
		title === 'Visual' ? (title = 'Visual haze') : title
		title === 'Pain' ? (title = 'Pain relief') : title
		title === 'Ego' ? (title = 'Ego death') : title
		title === 'Dry' ? (title = 'Dry mouth') : title
		title === 'A' ? (title = 'Runny nose') : title
		title === 'Déjà' ? (title = 'Déjà Vu') : title
		title === 'Brain' ? (title = 'Brain zaps') : title
		title === 'Back' ? (title = 'Back pain') : title

		for (const line of raw_description) {
			if (line.startsWith('[')) continue
			if (line === '') continue

			description.push(line)
		}
		return new Effect({ name: title, summary: summary, description: description, effectindex: url })
	}
}

export class EffectIndexEffectProvider extends EffectProviderAdapter {
	private effectRepository = new EffectCacheManager()

	async load(): Promise<Effect[]> {
		const effects: Effect[] = []

		const cachedEffects = await this.effectRepository.all()

		if (cachedEffects.length > 100) {
			return cachedEffects
		}

		for (const effect of effectindex) {
			effects.push(EffectIndexMapper.toDomain(effect))
		}

		for (const effect of effects) {
			await this.effectRepository.save(effect)
		}

		return effects
	}
}
