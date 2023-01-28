import { Substance } from 'osiris'
import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { getSubstanceFromPsychonautWiki } from '../../psychonautwiki/get-substance/get-substance.js'
import { request } from 'graphql-request'
import { AllSubstancesDocument, AllSubstancesQuery } from '../../psychonautwiki/gql/sdk/graphql.js'
import { PsychonautWikiMapper } from '../../psychonautwiki/psychonautwiki.mapper.js'

export class PsychonautWikiSubstanceProvider implements SubstanceProviderAdapter {
	async findSubstanceByName(name: string): Promise<Substance> {
		return await getSubstanceFromPsychonautWiki(name)
	}

	async getAll(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const mappedSubstances = new PsychonautWikiMapper().AllSubstancesQuery__Substances(response)
		return mappedSubstances
	}
}
