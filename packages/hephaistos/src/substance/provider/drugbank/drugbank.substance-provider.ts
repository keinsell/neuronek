import { Substance } from 'osiris'
import { SubstanceLocalStorage } from 'src/substance/substance.localstorage.js'
import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { DrugbankMapper } from './drugbank.mapper.js'
import dataset, { DrugElement, DrugbankD } from 'drugbank-dataset'
// eslint-disable-next-line node/no-extraneous-import

export class DrugbankSubstanceProvider implements SubstanceProviderAdapter {
	private mapper = new DrugbankMapper()
	private localstorage = new SubstanceLocalStorage('cache/drugbank.substances.json')

	async load(): Promise<Substance[]> {
		const substances: Substance[] = []

		// Restore cache
		if ((await this.localstorage.count()) !== 0) {
			return await this.localstorage.all()
		}

		for await (const substance of dataset as any as DrugElement[]) {
			substances.push(this.mapper.toDomain(substance))
		}

		for await (const s of substances) {
			await this.localstorage.save(s)
		}

		return substances
	}
}
