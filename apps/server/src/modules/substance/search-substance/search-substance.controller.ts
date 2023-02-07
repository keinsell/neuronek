import { Service } from 'diod'
import { Controller, Get, OperationId, Query, Route, SuccessResponse, Tags } from 'tsoa'

import { SearchResponse } from '../../search/search.response.js'
import { MeilisearchService } from '../../search/search.service.js'

@Service()
@Route('substance')
@Tags('substance')
export class SearchSubstanceController extends Controller {
	constructor(private service: MeilisearchService) {
		super()
	}
	/**
	 * @summary Search through available substances.
	 */
	@Get()
	@OperationId('search-substance')
	@SuccessResponse('200', 'OK')
	async searchSubstance(
		@Query('q') query: string
	): Promise<SearchResponse<{ id: string; name: string; common_names: string[] }>> {
		const response = await this.service.searchSubstance(query)
		// Response
		this.setStatus(200)
		return response
	}
}
