import { Prisma } from "@prisma/client";
import { Mapper } from "../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../common/lib/persistence/mapper/database-records";
import { Ingestion } from "./entity";
import { SubstanceMapper } from "../substance/mapper";
import { UserMapper } from "../user-v2/mapper";
import { RouteOfAdministrationClassification } from "../substance/entities/route-of-administration-classification.enum";

export class IngestionMapper
	implements
		Mapper<Ingestion, DatabaseRecords.IngestionCreateRecord, unknown>
{
	constructor(
		private substanceMapper: SubstanceMapper = new SubstanceMapper(),
		private userMapper: UserMapper = new UserMapper()
	) {}
	toPersistence(entity: Ingestion): Prisma.IngestionCreateInput {
		return {
			date: entity.date,
			dosage: entity.amount,
			route: entity.route,
			purity: entity.purity,
			Substance: {
				connect: {
					name: entity.substance.name,
				},
			},
			User: {
				connect: {
					username: String(entity.user.username),
				},
			},
		};
	}

	toDomain(record: DatabaseRecords.IngestionRecord): Ingestion {
		return new Ingestion(
			{
				date: record.date,
				amount: record.dosage,
				route: record.route as RouteOfAdministrationClassification,
				purity: record.purity ?? undefined,
				substance: this.substanceMapper.toDomain(record.Substance),
				user: this.userMapper.toDomain(record.User),
			},
			record.id
		);
	}

	toResponse?(entity: Ingestion): unknown {
		throw new Error("Method not implemented.");
	}
}
