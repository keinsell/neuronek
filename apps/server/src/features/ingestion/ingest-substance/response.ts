import { DosageClassification } from "../../../modules/substance/entities/dosage-classification.enum";
import { RouteOfAdministrationClassification } from "../../../modules/substance/entities/route-of-administration-classification.enum";

export interface IngestedSubstanceResponseDTO {
	substance: string;
	routeOfAdministration: RouteOfAdministrationClassification;
	dosageClassification: DosageClassification;
	dosage: string;
	dateOfIngestion: Date;
}
