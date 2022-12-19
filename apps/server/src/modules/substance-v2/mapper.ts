import { Prisma } from "@prisma/client";
import { Mapper } from "../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../common/lib/persistence/mapper/database-records";
import { Substance } from "./entity";
import { RouteOfAdministrationMapper } from "./mappers/route-of-administration.mapper";
import { PsychoactiveClass } from "./entities/psychoactive-class.enum";
import { TimeRange } from "../../utilities/range.vo";

export class SubstanceMapper
	implements
		Mapper<Substance, DatabaseRecords.SubstanceCreateRecord, unknown>
{
	constructor(
		private routeOfAdministrationMapper: RouteOfAdministrationMapper = new RouteOfAdministrationMapper()
	) {}

	toPersistence(entity: Substance): Prisma.SubstanceCreateInput {
		return {
			name: entity.name,
			commonNomenclature: entity.chemicalNomencalture.common,
			substitutiveNomenclature: entity.chemicalNomencalture.substitutive,
			systematicNomenclature: entity.chemicalNomencalture.systematic,
			chemicalClass: entity.chemicalClass,
			psychoactiveClass: entity.psychoactiveClass,
			routesOfAdministraton: {
				connect: [...entity.administrationBy.map((r) => r.id)],
			},
			timeToHalfTolerance:
				entity.addiction?.tolerance?.toleranceReversal?.reversalToHalf?.toString(),
			timeToZeroTolerance:
				entity.addiction?.tolerance?.toleranceReversal?.reversalToBaseline?.toString(),
		};
	}

	toDomain(record: DatabaseRecords.SubstanceRecord): Substance {
		return new Substance(
			{
				name: record.name,
				chemicalNomencalture: {
					common: record.commonNomenclature,
					substitutive: record.substitutiveNomenclature ?? undefined,
					systematic: record.systematicNomenclature ?? undefined,
				},
				chemicalClass: record.chemicalClass,
				psychoactiveClass:
					record.psychoactiveClass as PsychoactiveClass,
				administrationBy: record.routesOfAdministraton.map((r) =>
					this.routeOfAdministrationMapper.toDomain(r)
				),
				addiction: {
					tolerance: {
						toleranceReversal: {
							reversalToHalf: record.timeToHalfTolerance
								? TimeRange.fromString(
										record.timeToHalfTolerance
								  )
								: undefined,
							reversalToBaseline: record.timeToZeroTolerance
								? TimeRange.fromString(
										record.timeToZeroTolerance
								  )
								: undefined,
						},
					},
				},
			},
			record.id
		);
	}

	toResponse?(entity: Substance): unknown {
		throw new Error("Method not implemented.");
	}
}
