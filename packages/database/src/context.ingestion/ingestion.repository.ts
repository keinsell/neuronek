import { Dosage, Ingestion, RouteOfAdministrationClassification } from 'osiris'
import { BarePrismaRepositoryOfOsirisModel } from '../shared.core/prisma.repsitory.js'
import {
	Ingestion as PersistenceIngestion,
	Substance as PersistenceSubstance,
	Subject as PersistenceSubject,
	Prisma,
	PrismaClient
} from '@prisma/client'

type RawIngestion = PersistenceIngestion & { Substance?: PersistenceSubstance; Subject?: PersistenceSubject }

export class IngestionRepository
	implements BarePrismaRepositoryOfOsirisModel<Ingestion, Prisma.IngestionCreateInput, RawIngestion>
{
	toDomain(storageModel: RawIngestion): Ingestion {
		throw new Error('Method not implemented.')
	}
	toStorage(domainModel: Ingestion): Prisma.IngestionCreateInput<never> {
		throw new Error('Method not implemented.')
	}

	public prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation,
		{ result: {}; model: {}; query: {}; client: {} }
	>

	findById(id: any): Promise<Ingestion> {
		throw new Error('Method not implemented.')
	}
	exists(domainModel: Ingestion): Promise<boolean> {
		throw new Error('Method not implemented.')
	}
	save(domainModel: Ingestion): Promise<Ingestion> {
		throw new Error('Method not implemented.')
	}
	all(): Promise<Ingestion[]> {
		throw new Error('Method not implemented.')
	}
}
