import { request } from 'graphql-request'
import { Substance } from 'osiris'

import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { AllSubstancesDocument, AllSubstancesQuery } from './gql/sdk/graphql.js'
import { PsychonautWikiMapper } from './psychonautwiki.mapper.js'

export class PsychonautWikiSubstanceProvider implements SubstanceProviderAdapter {
	private mapper = new PsychonautWikiMapper()

	async load(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []

		for (const s of response.substances) {
			const substance = this.mapper.Substance__Substance(s)
			substances.push(substance)
		}

		return substances
	}
}
