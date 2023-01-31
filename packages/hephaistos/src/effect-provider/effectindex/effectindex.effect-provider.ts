import effecs from 'effectindex-dataset'
import { Effect } from 'osiris'

import { EffectProviderAdapter } from '../effect-provider.adapter.js'

export class EffectIndexEffectProvider extends EffectProviderAdapter {
	async findByName(name: string): Promise<Effect> {
		const effect = await effecs.find((effect: { title: string }): boolean => effect.title === name)
		return new Effect({ name: effect.title })
	}

	async all(): Promise<Effect[]> {
		const effects: Effect[] = []

		for (const effect of effecs) {
			effects.push(new Effect({ name: effect.title }))
		}

		return effects
	}
}
