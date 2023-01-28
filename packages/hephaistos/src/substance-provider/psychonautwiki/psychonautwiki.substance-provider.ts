import { RouteOfAdministrationTable, Substance, PsychoactiveClassification } from 'osiris'
import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { request } from 'graphql-request'
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

		return PsychonautwikiMapper.useGetSubstancesQuery(response)
	}

	async all(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []

		for (const s of response.substances) {
			substances.push(PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }))
		}

		return substances
	}
}
