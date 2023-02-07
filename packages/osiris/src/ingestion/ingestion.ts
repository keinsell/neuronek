import { Dosage } from '../dosage/dosage.js'
import { Mixture } from '../mixtures/mixture.model.js'
import { RouteOfAdministrationClassification } from '../route-of-administration/RouteOfAdministrationClassification.js'
import { Subject } from '../subject/subject.js'
import { Substance } from '../substance/substance.js'

export interface IngestionProperties {
	substance_name?: string
	mixture_id?: string
	routeOfAdministration?: RouteOfAdministrationClassification
	dosage?: Dosage
	Substance?: Substance
	Mixture?: Mixture
	date?: Date
	location?: string
	notes?: string
	subject_username: string
	Subject?: Subject
}

export class Ingestion {
	substance_name?: string
	mixture_id?: string
	routeOfAdministration?: RouteOfAdministrationClassification
	dosage?: Dosage
	Substance?: Substance
	Mixture?: Mixture
	date?: Date
	location?: string
	notes?: string

	private constructor(properties: IngestionProperties) {
		Object.assign(this, properties)
	}

	// eslint-disable-next-line jsdoc/require-returns
	/** Checks if ingestion contains information about ingested substance or mixture. If contains informations about mixture additionally checks if mixture contains information about it's content. */
	public hasKnownSubstance(): boolean {
		let hasSubstance = !!this.Substance

		if (!hasSubstance && this.Mixture) {
			hasSubstance = this.Mixture.ingredients?.some(ingredient => !!ingredient.substance_name)
		}

		return hasSubstance
	}

	static create(properties: IngestionProperties): Ingestion {
		return new Ingestion(properties)
	}
}
