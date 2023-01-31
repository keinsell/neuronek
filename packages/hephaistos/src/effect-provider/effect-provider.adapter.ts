import { Effect } from 'osiris'

export abstract class EffectProviderAdapter {
	abstract findByName(name: string): Promise<Effect | undefined>
	abstract all(): Promise<Effect[]>
}
