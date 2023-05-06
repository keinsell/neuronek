import { Service } from 'diod'
import { Controller, Get, OperationId, Query, Route, SuccessResponse, Tags } from 'tsoa'

import { SearchResponse } from '../../search/search.response.js'
import { MeilisearchService } from '../../search/search.service.js'

@Service()
@Route('effect')
@Tags('effect')
export class SearchEffectController extends Controller {
	constructor(private service: MeilisearchService) {
		super()
	}

	/**
	 * Search effects available in database based on https://effectindex.com and https://psychonautwiki.org.
	 * @summary Search through available effects.
	 */
	@Get()
	@OperationId('search-effects')
	@SuccessResponse('200', 'OK')
	async searchEffect(
		@Query('q') query: string
	): Promise<SearchResponse<{ id: string; name: string; summary: string }>> {
		const response = await this.service.searchEffects(query)
		// Response
		this.setStatus(200)
		return response
	}
}
