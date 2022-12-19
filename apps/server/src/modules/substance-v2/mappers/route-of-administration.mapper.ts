import { Mapper } from "../../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../../common/lib/persistence/mapper/database-records";
import { RouteOfAdministrationClassification } from "../entities/route-of-administration-classification.enum";
import {
	RouteOfAdministration,
	RouteOfAdministrationWithSubstance,
} from "../entities/route-of-administration.entity";

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
			type: entity.classification,
			theresholdDosage: entity.dosage.thereshold,
			lightDosage: entity.dosage.light,
			commonDosage: entity.dosage.moderate,
			strongDosage: entity.dosage.strong,
			heavyDosage: entity.dosage.heavy,
			onset: entity.duration.onset,
			comeup: entity.duration.comeup,
			peak: entity.duration.peak,
			offset: entity.duration.offset,
			aftereffects: entity.duration.aftereffects,
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
					record.type as RouteOfAdministrationClassification,
				bioavailability: record.bioavailability ?? undefined,
				dosage: {
					thereshold: record.theresholdDosage,
					light: record.lightDosage,
					moderate: record.commonDosage,
					strong: record.strongDosage,
					heavy: record.heavyDosage,
					overdose: record.heavyDosage * 2,
				},
				duration: {
					onset: record.onset,
					comeup: record.comeup,
					peak: record.peak,
					offset: record.offset,
					aftereffects: record.aftereffects,
				},
			},
			record.id
		);
	}

	toResponse?(entity: RouteOfAdministration): unknown {
		throw new Error("Method not implemented.");
	}
}
