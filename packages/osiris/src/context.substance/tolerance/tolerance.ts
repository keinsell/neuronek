import { PsychoactiveClassification } from '../psychoactive-class/psychoactive-classification'

export interface ToleranceProperties {
	development?: {
		/** Dosage to Tolerance Ratio after ingestion. Some substances are developing tolerance slowly by reducing produced effects by each ingestion, there we can assume simple factor that every usage in prolonged use reduces substance effects by 5% and some psychedelics like acid builds up tolerance of 100% to ingested amount. */
		dosageToToleranceRatio?: number
		/** Description */
		description?: string
	}

	/** Tolerance often is going be reduced with major factor which is time. There we can define time range of which tolerance is reduced to half and to zero. */
	reduction?: {
		/** Time in hours to tolerance reduction of 50% */
		toleranceHalfingTime?: number
		/** Time in hours to tolerance reduction of 100% */
		toleranceBaselineTime?: number
		/** Description */
		description?: string
	}

	/** Most of substances are sharing tolerance each other due to similar mechanisms of actions. For now we shgould only take attention to psychoactive groups which may share tolerance. */
	crossTolerance?: {
		byPsychoactiveGroup?: PsychoactiveClassification
	}
}

/** Tolerance class will try to define substance's way of development tolerance and how tolerance is reduced. */
export class Tolerance implements ToleranceProperties {
	development?: {
		/** Dosage to Tolerance Ratio after ingestion. Some substances are developing tolerance slowly by reducing produced effects by each ingestion, there we can assume simple factor that every usage in prolonged use reduces substance effects by 5% and some psychedelics like acid builds up tolerance of 100% to ingested amount. */
		dosageToToleranceRatio?: number
		/** Description */
		description?: string
	}

	/** Tolerance often is going be reduced with major factor which is time. There we can define time range of which tolerance is reduced to half and to zero. */
	reduction?: {
		/** Time in hours to tolerance reduction of 50% */
		toleranceHalfingTime?: number
		/** Time in hours to tolerance reduction of 100% */
		toleranceBaselineTime?: number
		/** Description */
		description?: string
	}

	/** Most of substances are sharing tolerance each other due to similar mechanisms of actions. For now we shgould only take attention to psychoactive groups which may share tolerance. */
	crossTolerance?: {
		byPsychoactiveGroup?: PsychoactiveClassification
	}

	constructor(payload: ToleranceProperties = {}) {
		this.development = payload.development
		this.reduction = payload.reduction
	}
}
