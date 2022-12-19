import { Entity } from "../../../common/lib/domain/entity";
import { Substance } from "../entity";
import { DosageClassification } from "./dosage-classification.enum";
import { PhaseClassification } from "./phase-classification.enum";
import { RouteOfAdministrationClassification } from "./route-of-administration-classification.enum";

export interface RouteOfAdministrationProperties {
	classification: RouteOfAdministrationClassification;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: number;
	};
	duration: {
		[duration in PhaseClassification]: number;
	};
}

export class RouteOfAdministration
	extends Entity
	implements RouteOfAdministration
{
	classification: RouteOfAdministrationClassification;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: number;
	};
	duration: {
		[duration in PhaseClassification]: number;
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
