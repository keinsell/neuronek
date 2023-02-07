import { EffectRepository, SubstanceRepository } from 'database'
import { Service } from 'diod'
import { MeiliSearch } from 'meilisearch'

import { PrismaService } from '../../shared/infrastructure/prisma/prisma.js'
import { SearchResponse } from './search.response.js'

@Service()
export class MeilisearchService {
	private substanceRepository: SubstanceRepository
	private effectRepository: EffectRepository
	private melisearch: MeiliSearch = new MeiliSearch({
		host: 'http://localhost:7700',
		apiKey: 'masterKey'
	})

	constructor(protected prisma: PrismaService) {
		this.substanceRepository = new SubstanceRepository(prisma)
		this.effectRepository = new EffectRepository(prisma)
	}

	async index() {
		const substance_index = await this.substanceRepository.buildSearchIndexDocument()
		const effect_index = await this.effectRepository.buildSearchIndexDocument()

		await this.melisearch.index('substances').addDocuments(substance_index)
		await this.melisearch.index('effects').addDocuments(effect_index)
	}

	async search(query: string, index: 'substances' | 'effects') {
		return await this.melisearch.index(index).search(query)
	}

	async searchEffects(query: string): Promise<SearchResponse<{ id: string; name: string; summary: string }>> {
		const search = await this.search(query, 'effects')

		return {
			hits: search.hits as any,
			estimatedTotal: search.estimatedTotalHits
		}
	}

	async searchSubstance(query: string): Promise<SearchResponse<{ id: string; name: string; common_names: string[] }>> {
		const search = await this.search(query, 'substances')

		return {
			hits: search.hits as any,
			estimatedTotal: search.estimatedTotalHits
		}
	}
}
