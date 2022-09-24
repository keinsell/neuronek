import { Entity } from "../../../../common/entity/entity.common";
import { DosageClassification } from "../../substance/entities/dosage.entity";
import { PhaseType } from "../../substance/entities/phase.entity";

export enum RouteOfAdministrationType {
	oral = "oral",
	sublingual = "sublingual",
	buccal = "buccal",
	insufflated = "insufflated",
	rectal = "rectal",
	transdermal = "transdermal",
	subcutaneous = "subcutaneous",
	intramuscular = "intramuscular",
	interavenous = "interavenous",
	smoked = "smoked",
}

export interface RouteOfAdministrationProperties {
	route: RouteOfAdministrationType;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: number;
	};
	duration: {
		[duration in PhaseType]: number;
	};
	_substance: string;
}

export class RouteOfAdministration
	extends Entity
	implements RouteOfAdministrationProperties
{
	route: RouteOfAdministrationType;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: number;
	};
	duration: {
		[duration in PhaseType]: number;
	};
	_substance: string;

	constructor(
		properties: RouteOfAdministrationProperties,
		id?: string | number,
	) {
		super(id);
		this.route = properties.route;
		this.bioavailability = properties.bioavailability;
		this.dosage = properties.dosage;
		this.duration = properties.duration;
		this._substance = properties._substance;
	}
}
