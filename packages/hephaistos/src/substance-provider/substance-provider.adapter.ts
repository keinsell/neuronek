import { Substance } from 'osiris'

export abstract class SubstanceProviderAdapter {
	abstract findSubstanceByName(name: string): Promise<Substance | undefined>
	abstract all(): Promise<Substance[]>
}
