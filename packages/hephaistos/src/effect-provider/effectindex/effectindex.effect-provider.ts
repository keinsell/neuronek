import effecs from 'effectindex-dataset'
import { Effect } from 'osiris'

import { EffectProviderAdapter } from '../effect-provider.adapter.js'

export class EffectIndexEffectProvider extends EffectProviderAdapter {
	findByName(name: string): Promise<Effect> {}
	all(): Promise<Effect[]> {
		const effects: Effect[] = []

		for (const effect in effecs) {
			effects.push(new Effect({ name: effect }))
		}

		return Promise.resolve(effects)
	}
}
