import { Result, ok } from 'neverthrow'
import { Usecase } from '../../../shared/common/domain/usecase.js'
import { CreateIngestionRequest } from './create-ingestion.request.js'
import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.js'
import { Service } from 'diod'

@Service()
export class CreateIngestionService implements Usecase<CreateIngestionRequest, Ingestion, never> {
	constructor(private prismaService: PrismaService) {}

	async execute(request: CreateIngestionRequest): Promise<Result<Ingestion, never>> {
		// const ingestion = Ingestion.create({
		// 	routeOfAdministration: request.routeOfAdministration as RouteOfAdministrationClassification,
		// 	dosage: new Dosage({
		// 		amount: request.dosage_amount,
		// 		unit: request.dosage_unit
		// 	}),
		// 	substance_name: request.substance_name,
		// 	subject_username: user.username
		// })
		// return ok(ingestion)

		throw new Error('Method not implemented.')
	}
}
