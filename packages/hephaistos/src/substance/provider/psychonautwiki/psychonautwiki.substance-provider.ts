import { request } from 'graphql-request'
import { Substance } from 'osiris'
import { SubstanceLocalStorage } from 'src/substance/substance.localstorage.js'

import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { AllSubstancesDocument, AllSubstancesQuery } from './gql/sdk/graphql.js'
import { PsychonautWikiMapper } from './psychonautwiki.mapper.js'

export class PsychonautWikiSubstanceProvider implements SubstanceProviderAdapter {
	private mapper = new PsychonautWikiMapper()
	private localstorage = new SubstanceLocalStorage('cache/psychonautwiki.substances.json')

	async load(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []

		// Restore cache
		if ((await this.localstorage.count()) !== 0) {
			return await this.localstorage.all()
		}

		for (const s of response.substances) {
			const substance = this.mapper.Substance__Substance(s)
			substances.push(substance)
		}

		for await (const s of substances) {
			await this.localstorage.save(s)
		}

		return substances
	}
}
