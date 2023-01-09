import { NumberRange, TimeRange } from "../../../utilities/range.vo";

export interface SubstanceAddiction {
	dependence?: {};
	abusePotential?: {};
	tolerance?: {
		toleranceDevelopment?: {};
		toleranceReversal?: {
			pharmacological?: {};
			nonPharmacological?: {};
			reversalToHalf?: TimeRange;
			reversalToBaseline?: TimeRange;
		};
	};
	withdrawal?: {};
}
