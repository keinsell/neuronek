import { request } from 'graphql-request'
import { GetSubstancesDocument, GetSubstancesQuery } from '../gql/sdk/graphql.js'
import { PsychonautWikiMapper, mapGetSubstanceQueryToSubstance } from '../psychonautwiki.mapper.js'
import { Substance } from '../../../shared/substance/substance.js'

export async function getSubstanceFromPsychonautWiki(substanceName: string): Promise<Substance | undefined> {
	const response = await request<GetSubstancesQuery>('https://api.psychonautwiki.org', GetSubstancesDocument, {
		name: substanceName
	})

	if (response.substances.length === 0) {
		return undefined
	}

	return new PsychonautWikiMapper().GetSubstanceQuery__Substance(response)
}
