import { request } from 'graphql-request'
import { Effect, Substance } from 'osiris'
import { EffectCacheManager } from 'src/effect-provider/effect.cache-manager.js'

import { SubstanceProviderAdapter } from '../substance-provider.adapter.js'
import { SubstanceCacheManager } from '../substance.cache-manager.js'
import { AllSubstancesDocument, AllSubstancesQuery } from './gql/sdk/graphql.js'
import { PsychonautwikiMapper } from './psychonautwiki.mapper.js'

export class PsychonautWikiSubstanceProvider implements SubstanceProviderAdapter {
	private substanceRepository = new SubstanceCacheManager()
	private effectRepository = new EffectCacheManager()

	async load(): Promise<Substance[]> {
		const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})
		const substances: Substance[] = []
		const allSubstance = await this.substanceRepository.all()

		if (allSubstance.length > 200) {
			return allSubstance
		}

		for (const s of response.substances) {
			console.log(`Processing ${s.name} from PsychonautWiki`)

			const effects: Effect[] = []

			for (const effect of PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }).effects) {
				const exists = await this.effectRepository.findByName(effect.name)
				if (exists) {
					effects.push(exists)
				}
			}

			const substance = PsychonautwikiMapper.useGetSubstancesQuery({ substances: [s] }).substance

			substance.subjective_effects = effects

			substances.push(substance)
		}

		for (const substance of substances) {
			console.log(substance)
			await this.substanceRepository.save(substance)
		}

		return substances
	}
}
