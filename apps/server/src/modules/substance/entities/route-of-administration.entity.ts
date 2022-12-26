import { Entity } from "../../../common/lib/domain/entity";
import { MassUnit } from "../../../utilities/mass.vo";
import { TimeRange } from "../../../utilities/range.vo";
import { Substance } from "../entity";
import { DosageClassification } from "./dosage-classification.enum";
import { PhaseClassification } from "./phase-classification.enum";
import { RouteOfAdministrationClassification } from "./route-of-administration-classification.enum";

export interface RouteOfAdministrationProperties {
	classification: RouteOfAdministrationClassification;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: MassUnit;
	};
	duration: {
		[duration in PhaseClassification]: TimeRange;
	};
}

export class RouteOfAdministration
	extends Entity
	implements RouteOfAdministration
{
	classification: RouteOfAdministrationClassification;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: MassUnit;
	};
	duration: {
		[duration in PhaseClassification]: TimeRange;
	};
	constructor(
		properties: RouteOfAdministrationProperties,
		id?: string | number
	) {
		super(id);
		this.classification = properties.classification;
		this.bioavailability = properties.bioavailability;
		this.dosage = properties.dosage;
		this.duration = properties.duration;
	}

	public getTimeToPhase(phase: PhaseClassification) {
		const { duration } = this;

		if (phase === PhaseClassification.onset) {
			return new TimeRange(0, 0);
		}

		if (phase === PhaseClassification.comeup) {
			return duration.onset;
		}

		if (phase === PhaseClassification.peak) {
			return duration.onset.add(duration.comeup);
		}

		if (phase === PhaseClassification.offset) {
			return duration.onset.add(duration.comeup).add(duration.peak);
		}

		if (phase === PhaseClassification.aftereffects) {
			return duration.onset
				.add(duration.comeup)
				.add(duration.peak)
				.add(duration.offset);
		}

		throw new Error("Unknown phase");
	}

	/** Total duration presents time from ingestion to end of noticable substance positive effects (exluding aftereffects). */
	get totalDuration(): TimeRange {
		const { duration } = this;
		return duration.onset
			.add(duration.comeup)
			.add(duration.peak)
			.add(duration.offset);
	}
}

export class RouteOfAdministrationWithSubstance extends RouteOfAdministration {
	substance: Substance;
	constructor(
		properties: RouteOfAdministrationProperties,
		substance: Substance,
		id?: string | number
	) {
		super(properties, id);
		this.substance = substance;
	}
}
