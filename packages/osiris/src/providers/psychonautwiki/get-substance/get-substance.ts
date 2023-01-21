import { request } from 'graphql-request'
import { GetSubstancesDocument } from '../gql/sdk/graphql.js'

export async function getSubstanceFromPsychonautWiki(substanceName: string) {
	const response = await request('https://api.psychonautwiki.org', GetSubstancesDocument, { name: substanceName })

	return response
}
