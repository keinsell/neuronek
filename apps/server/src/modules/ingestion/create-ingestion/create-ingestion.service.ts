import { Result, ok } from 'neverthrow'
import { Usecase } from '../../../shared/common/domain/usecase.js'
import { CreateIngestionRequest } from './create-ingestion.request.js'
import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.js'
import { Service } from 'diod'
import { User } from '../../user/user.entity.js'
import { IngestionRepository } from 'database'

@Service()
export class CreateIngestionService implements Usecase<CreateIngestionRequest, Ingestion, never> {
	private ingestionRepository: IngestionRepository

	constructor(private prismaService: PrismaService) {
		this.ingestionRepository = new IngestionRepository(this.prismaService)
	}

	async execute(request: CreateIngestionRequest, user: User): Promise<Result<Ingestion, never>> {
		const ingestion = Ingestion.create({
			routeOfAdministration: request.routeOfAdministration as RouteOfAdministrationClassification,
			dosage: new Dosage({
				amount: request.dosage_amount,
				unit: request.dosage_unit
			}),
			substance_name: request.substance_name,
			subject_username: user.username
		})

		const createIngestion = await this.ingestionRepository.saveOrUpdate(ingestion)

		return ok(createIngestion)
	}
}
