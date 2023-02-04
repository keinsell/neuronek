import { Service } from 'diod'
import { Controller, Get, OperationId, Route, SuccessResponse, Tags } from 'tsoa'

import { EffectResponse } from '../effect.response.js'
import { GetEffectsService } from './get-effects.service.js'

@Service()
@Route('effects')
@Tags('effect')
export class GetEffectsController extends Controller {
	constructor(private service: GetEffectsService) {
		super()
	}

	/**
	 * Gets all available effects based on https://effectindex.com and https://psychonautwiki.org.
	 * @summary Get all available effects.
	 */
	@Get()
	@OperationId('get-effects')
	@SuccessResponse('200', 'OK')
	async registerUser(): Promise<EffectResponse[]> {
		const response = await this.service.execute()

		// Handle Error
		if (response.isErr()) {
			this.setStatus(400)
			return response as any
		}

		const responses: EffectResponse[] = response.value.map(effect => ({
			name: effect.name,
			summary: effect.summary,
			page: effect.description
		}))

		// Response
		this.setStatus(200)
		return responses
	}
}
