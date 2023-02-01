import { Effect } from 'osiris'

export abstract class EffectProviderAdapter {
	abstract load(): Promise<Effect[]>
}
