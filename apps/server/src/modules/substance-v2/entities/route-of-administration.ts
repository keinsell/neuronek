import { DosageClassification } from "./dosage-classification.enum";
import { PhaseClassification } from "./phase-classification.enum";
import { RouteOfAdministrationClassification } from "./route-of-administration-classification.enum";

export interface RouteOfAdministration {
	classification: RouteOfAdministrationClassification;
	bioavailability?: number;
	dosage: {
		[dose in DosageClassification]: number;
	};
	duration: {
		[duration in PhaseClassification]: number;
	};
}
