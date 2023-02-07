import { Service } from 'diod'
import { Controller, Get, OperationId, Route, SuccessResponse, Tags } from 'tsoa'
import { DumpSubstancesService } from './dump-substances.service.js'
import { SubstanceResponse } from '../substance.response.js'

@Service()
@Route('dump')
@Tags('dump', 'substance')
export class DumpSubstancesController extends Controller {
	constructor(private service: DumpSubstancesService) {
		super()
	}

	/**
	 * Returns all available substances.
	 * @summary Get all available substances.
	 */
	@Get('/substances')
	@OperationId('dump-substances')
	@SuccessResponse('200', 'OK')
	async registerUser(): Promise<SubstanceResponse[]> {
		const response = await this.service.execute()

		// Handle Error
		if (response.isErr()) {
			this.setStatus(400)
			return response as any
		}

		const responses: SubstanceResponse[] = response.value.map(substance => ({
			name: substance.name,
			summary: ''
		}))

		// Response
		this.setStatus(200)
		return responses
	}
}
