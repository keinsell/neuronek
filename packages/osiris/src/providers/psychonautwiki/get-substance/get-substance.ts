import { request } from 'graphql-request'
import { GetSubstancesDocument, GetSubstancesQuery } from '../gql/sdk/graphql.js'

export async function getSubstanceFromPsychonautWiki(substanceName: string) {
	const response = await request<GetSubstancesQuery>('https://api.psychonautwiki.org', GetSubstancesDocument, {
		name: substanceName
	})

	if (response.substances.length === 0) {
		return undefined
	}

	return response[0]
}
