import { EffectRepository, PrismaClient } from 'database'
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

		const connection = new PrismaClient()
		await connection.$connect()

		for (const effect of PsychonautwikiMapper.useGetSubstancesQuery(response).effects) {
			await new EffectRepository(connection).save(effect)
		}

		await connection.$disconnect()

		return PsychonautwikiMapper.useGetSubstancesQuery(response).substance
	}

	async all(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []
		const connection = new PrismaClient()
		await connection.$connect()

		for (const s of response.substances) {
			console.log(`Processing ${s.name} from PsychonautWiki`)
			for (const effect of PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }).effects) {
				await new EffectRepository(connection).save(effect)
			}

			// TODO: Find effects from database and connect them.
			substances.push(PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }).substance)
		}

		await connection.$disconnect()
		return substances
	}
}
