import ms from "ms";
import { Mapper } from "../../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../../common/lib/persistence/mapper/database-records";
import { RouteOfAdministrationClassification } from "../entities/route-of-administration-classification.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationWithSubstance,
} from "../entities/route-of-administration.entity";
import { MassUnit } from "../../../utilities/mass.vo";

export class RouteOfAdministrationMapper
	implements
		Mapper<
			RouteOfAdministration,
			DatabaseRecords.RouteOfAdministrationCreateRecord,
			unknown
		>
{
	toPersistence(
		entity: RouteOfAdministrationWithSubstance
	): DatabaseRecords.RouteOfAdministrationCreateRecord {
		return {
			classification: entity.classification,
			theresholdDosage: entity.dosage.thereshold.toString(),
			lightDosage: entity.dosage.light.toString(),
			commonDosage: entity.dosage.moderate.toString(),
			strongDosage: entity.dosage.strong.toString(),
			heavyDosage: entity.dosage.heavy.toString(),
			onset: ms(entity.duration.onset),
			comeup: ms(entity.duration.comeup),
			peak: ms(entity.duration.peak),
			offset: ms(entity.duration.offset),
			aftereffects: ms(entity.duration.aftereffects),
			bioavailability: entity.bioavailability,
			Substance: {
				connect: {
					name: entity.substance.name,
				},
			},
		};
	}

	toDomain(
		record: DatabaseRecords.RouteOfAdministrationRecord
	): RouteOfAdministration {
		return new RouteOfAdministration(
			{
				classification:
					record.classification as RouteOfAdministrationClassification,
				bioavailability: record.bioavailability ?? undefined,
				dosage: {
					thereshold: MassUnit.fromString(record.theresholdDosage),
					light: MassUnit.fromString(record.lightDosage),
					moderate: MassUnit.fromString(record.commonDosage),
					strong: MassUnit.fromString(record.strongDosage),
					heavy: MassUnit.fromString(record.heavyDosage),
					overdose: MassUnit.fromBase(
						MassUnit.fromString(record.heavyDosage).baseScalar * 2
					),
				},
				duration: {
					onset: ms(record.onset),
					comeup: ms(record.comeup),
					peak: ms(record.peak),
					offset: ms(record.offset),
					aftereffects: ms(record.aftereffects),
				},
			},
			record.id
		);
	}

	toResponse?(entity: RouteOfAdministration): unknown {
		throw new Error("Method not implemented.");
	}
}
