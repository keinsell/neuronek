import { Dosage } from '../dosage/dosage.js'
import { Mixture } from '../mixtures/mixture.model.js'
import { RouteOfAdministrationClassification } from '../route-of-administration/RouteOfAdministrationClassification.js'
import { Substance } from '../substance/substance.js'

export class Ingestion {
	substance?: Substance
	mixture?: Mixture
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

	private constructor(properties: {
		substance?: Substance
		dosage?: Dosage
		routeOfAdministration?: RouteOfAdministrationClassification
		purity?: number
		isDosageEstimate?: boolean
	}) {
		Object.assign(this, properties)
	}

	// eslint-disable-next-line jsdoc/require-returns
	/** Checks if ingestion contains information about ingested substance or mixture. If contains informations about mixture additionally checks if mixture contains information about it's content. */
	public hasKnownSubstance(): boolean {
		let hasSubstance = !!this.substance

		if (!hasSubstance && this.mixture) {
			hasSubstance = this.mixture.ingredients?.some(ingredient => !!ingredient.substance_name)
		}

		return hasSubstance
	}

	static create(properties: {
		substance?: Substance
		dosage?: Dosage
		routeOfAdministration?: RouteOfAdministrationClassification
		purity?: number
		isDosageEstimate?: boolean
	}): Ingestion {
		return new Ingestion(properties)
	}
}
