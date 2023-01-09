import { PrismaClient } from "@prisma/client";
import {
	Paginated,
	PaginatedQueryParameters,

} from "../../common/lib/persistence/repository";
import { Ingestion } from "./entity";
import { PrismaInfrastructre } from "../../infrastructure/prisma";
import { IngestionMapper } from "./mapper";
import {Repository} from '@internal/common';

export class IngestionRepository implements Repository<Ingestion> {
	constructor(
		public database: PrismaClient = PrismaInfrastructre,
		private ingestionMapper: IngestionMapper = new IngestionMapper(),
	) {}
	async save(entity: Ingestion): Promise<Ingestion> {
		const isIngestionWithProvidedId = await this.database.ingestion.findUnique({
			where: {
				id: entity.id,
			},
		});

		let createdOrUpdatedIngestion: Ingestion;

		if (isIngestionWithProvidedId) {
			const updatedIngestion = await this.database.ingestion.update({
				where: {
					id: entity.id,
				},
				data: this.ingestionMapper.toPersistence(entity),
				include: {
					Substance: {
						include: {
							routesOfAdministraton: true,
						},
					},
					User: true,
				},
			});

			createdOrUpdatedIngestion =
				this.ingestionMapper.toDomain(updatedIngestion);
		} else {
			const createdUser = await this.database.ingestion.create({
				data: this.ingestionMapper.toPersistence(entity),
				include: {
					Substance: {
						include: {
							routesOfAdministraton: true,
						},
					},
					User: true,
				},
			});

			createdOrUpdatedIngestion = this.ingestionMapper.toDomain(createdUser);
		}

		console.log(createdOrUpdatedIngestion);

		return createdOrUpdatedIngestion;
	}

	async findAllByIngesterUsername(username: string): Promise<Ingestion[]> {}
	async countAllByIngesterUsername(username: string): Promise<number> {
		return await this.database.ingestion.count({
			where: {
				User: {
					username: username,
				},
			},
		});
	}

	findById(id: string): Promise<Ingestion | null> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<Ingestion[]> {
		throw new Error("Method not implemented.");
	}
	findAllPaginated(
		parameters: PaginatedQueryParameters,
	): Promise<Paginated<Ingestion>> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	transaction<T>(callback: () => Promise<T>): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
