import { IngestionPayload, Prisma, PrismaClient, Ingestion as PrismaIngestion } from '@prisma/client'
import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'
import { SubstanceMapper } from './substance.repository.js'

export class IngestionMapper {
	toDomain(payload: PrismaIngestion): Ingestion {
		return Ingestion.create({
			routeOfAdministration: payload.routeOfAdministration as RouteOfAdministrationClassification,
			dosage: new Dosage({
				amount: payload.dosage_amount,
				unit: payload.dosage_unit
			}),
			substance_name: payload.substanceName,
			subject_username: payload.userId
		})
	}

	toPersistence(ingestion: Ingestion): Prisma.IngestionCreateInput {
		let payload: Prisma.IngestionCreateInput = {
			routeOfAdministration: ingestion.routeOfAdministration,
			dosage_amount: ingestion.dosage.scalar,
			dosage_unit: ingestion.dosage.unit
		}

		if (ingestion.substance_name || ingestion.Substance || ingestion.Substance.name) {
			payload = {
				...payload,
				Substance: {
					connect: {
						name: ingestion.substance_name || ingestion.Substance.name
					}
				}
			}
		}

		return payload
	}
}

export class IngestionRepository {
	private mapper = new IngestionMapper()

	constructor(private prisma: PrismaClient) {}

	async findOneById(id: string): Promise<Ingestion | undefined> {
		const payload = await this.prisma.ingestion.findUnique({
			where: {
				id: id
			}
		})

		if (!payload) return undefined

		return this.mapper.toDomain(payload)
	}

	async saveOrUpdate(ingestion: Ingestion): Promise<Ingestion> {
		const payload = this.mapper.toPersistence(ingestion)

		// Find existing ingestion
		const existing = await this.findOneById(ingestion.id)

		// Update existing ingestion
		if (existing) {
			const updated = await this.prisma.ingestion.update({
				where: {
					id: ingestion.id
				},
				data: payload,
				include: {
					Substance: true
				}
			})

			return this.mapper.toDomain(updated)
		}

		const saved = await this.prisma.ingestion.create({
			data: payload,
			include: {
				Substance: true
			}
		})

		return this.mapper.toDomain(saved)
	}
}
