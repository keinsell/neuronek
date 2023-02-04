import { Substance } from 'osiris'

export abstract class SubstanceProviderAdapter {
	abstract load(): Promise<Substance[]>
}
