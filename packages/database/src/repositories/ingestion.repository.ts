import { IngestionPayload, Prisma, Ingestion as PrismaIngestion } from '@prisma/client'
import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'
import { SubstanceMapper } from './substance.repository.js'

// export class IngestionMapper {
// 	toDomain(payload: PrismaIngestion): Ingestion {
// 		return Ingestion.create({
// 			routeOfAdministration: payload.routeOfAdministration as RouteOfAdministrationClassification
// 		})
// 	}

// 	toPersistence(ingestion: Ingestion): Prisma.IngestionCreateInput {
// 		return {
// 			routeOfAdministration: ingestion.routeOfAdministration,
// 			dosage_amount: ingestion.dosage.scalar,
// 			dosage_unit: ingestion.dosage.unit,
// 			Substance: {
// 				connect: {
// 					name: ingestion.substance.name
// 				}
// 			}
// 		}
// 	}
// }

// export class IngestionRepository {}
