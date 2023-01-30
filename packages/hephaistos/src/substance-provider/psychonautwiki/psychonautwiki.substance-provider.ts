import { request } from 'graphql-request'
import { Substance } from 'osiris'

import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import {
	AllSubstancesDocument,
	AllSubstancesQuery,
	GetSubstancesDocument,
	GetSubstancesQuery
} from './gql/sdk/graphql.js'
import { PsychonautwikiMapper } from './psychonautwiki.mapper.js'

export class PsychonautWikiSubstanceProvider implements SubstanceProviderAdapter {
	async findSubstanceByName(name: string): Promise<Substance> {
		const response = await request<GetSubstancesQuery>('https://api.psychonautwiki.org', GetSubstancesDocument, {
			name: name
		})

		if (response.substances.length === 0) {
			return undefined
		}

		// TODO: Find effects from database and connect them.

		return PsychonautwikiMapper.useGetSubstancesQuery(response).substance
	}

	async all(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []

		for (const s of response.substances) {
			// TODO: Find effects from database and connect them.
			substances.push(PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }).substance)
		}

		return substances
	}
}
