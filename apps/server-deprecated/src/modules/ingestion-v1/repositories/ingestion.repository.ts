import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { User } from "../../user/entities/user.entity";
import { Ingestion } from "../entities/ingestion.entity";
import { ingestionMapper } from "../mappers/ingestion.mapper";

export class IngestionRepository implements Repository<Ingestion> {
	db = PrismaInstance;
	mapper = ingestionMapper;

	async save(entity: Ingestion): Promise<Ingestion> {
		const exists = await this.exists(entity);

		let createdOrUpdateEntity: Ingestion;

		if (exists) {
			const presistence = this.mapper.toPersistence(entity);
			const updated = await this.db.ingestion.update({
				where: {
					id: String(entity.id),
				},
				include: {
					Ingester: true,
					Substance: {
						include: {
							routesOfAdministraton: true,
							OccuranceOfEffect: {
								include: {
									Effect: true,
								},
							},
						},
					},
				},
				data: presistence,
			});

			createdOrUpdateEntity = this.mapper.toDomain(updated);
		} else {
			const presistence = this.mapper.toPersistence(entity);
			const created = await this.db.ingestion.create({
				data: presistence,
				include: {
					Ingester: true,
					Substance: {
						include: {
							routesOfAdministraton: true,
							OccuranceOfEffect: {
								include: {
									Effect: true,
								},
							},
						},
					},
				},
			});

			createdOrUpdateEntity = this.mapper.toDomain(created);
		}

		return createdOrUpdateEntity;
	}

	async exists(entity: Ingestion): Promise<boolean> {
		const findIngestionById = await this.findIngestionById(entity.id);

		return findIngestionById ? true : false;
	}

	delete(entity: Ingestion): Promise<boolean> {
		console.log(entity);
		throw new Error("Method not implemented.");
	}

	async findIngestionById(id: string | number): Promise<Ingestion | undefined> {
		const findIngestionById = await this.db.ingestion.findUnique({
			where: {
				id: String(id),
			},
			include: {
				Substance: {
					include: {
						routesOfAdministraton: true,
						OccuranceOfEffect: {
							include: {
								Effect: true,
							},
						},
					},
				},
				Ingester: true,
			},
		});

		return findIngestionById
			? this.mapper.toDomain(findIngestionById)
			: undefined;
	}

	async findIngestionsByIngester(ingester: User) {
		const entires = await this.db.ingestion.findMany({
			where: {
				ingesterId: String(ingester.id),
			},
			include: {
				Substance: {
					include: {
						routesOfAdministraton: true,
						OccuranceOfEffect: {
							include: {
								Effect: true,
							},
						},
					},
				},
				Ingester: true,
			},
		});

		return entires.map((entry) => {
			return this.mapper.toDomain(entry);
		});
	}
}

export const ingestionRepository = new IngestionRepository();
