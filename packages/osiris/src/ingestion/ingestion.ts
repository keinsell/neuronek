import { Dosage } from '../dosage/dosage.js'
import { RouteOfAdministrationClassification } from '../route-of-administration/RouteOfAdministrationClassification.js'
import { Substance } from '../substance/substance.js'

export interface IngestionProperties {
	substance?: Substance
	dosage?: Dosage
	routeOfAdministration?: RouteOfAdministrationClassification
	// TODO: Should this be refactored into Dosage (or maybe separate Dosage class)?
	purity?: number
	// TODO: Should this be refactored into Dosage (or maybe separate Dosage class)?
	/** This field should be marked if subject isn't sure about measured dosage, thus this should not be taken in exact calculations. */
	isDosageEstimate?: boolean
	// TODO: Add forms of substances ex. powder, liquid, capsule, gel, etc.
	form?: string
	date?: Date
	location?: string
	notes?: string
}

export class Ingestion implements IngestionProperties {
	substance?: Substance
	dosage?: Dosage
	routeOfAdministration?: RouteOfAdministrationClassification
	// TODO: Should this be refactored into Dosage (or maybe separate Dosage class)?
	purity?: number
	// TODO: Should this be refactored into Dosage (or maybe separate Dosage class)?
	/** This field should be marked if subject isn't sure about measured dosage, thus this should not be taken in exact calculations. */
	isDosageEstimate?: boolean
	// TODO: Add forms of substances ex. powder, liquid, capsule, gel, etc.
	form?: string
	date?: Date
	location?: string
	notes?: string

	constructor(payload: IngestionProperties) {
		Object.assign(this, payload)
	}
}
