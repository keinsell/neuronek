import { Entity } from '../shared.core/entity.js'
import { Dosage } from './dosage/dosage.js'
import { Mixture } from '../context.mixture/mixture.model.js'
import { RouteOfAdministrationClassification } from '../context.substance/route-of-administration-table/RouteOfAdministrationClassification.js'
import { Subject } from '../context.subject/subject.js'
import { Substance } from '../context.substance/substance.js'
import { nanoid } from 'nanoid'

export interface IngestionProperties {
	// Optionally attach Substance to Ingestion
	substance_name?: string
	Substance?: Substance
	// Optionally attach Mixture to Ingestion
	mixture_id?: string
	Mixture?: Mixture
	// Add RouteOfAdministrationClassification to Ingestion
	routeOfAdministration: RouteOfAdministrationClassification
	// Dosage
	dosage: Dosage
	date?: Date
	location?: string
	notes?: string
	// Optionally attach User to Ingestion
	subject_username?: string
	Subject?: Subject
}

// TODO: Think how to implement relations to this calss.
export class Ingestion extends Entity {
	/** Substance name. */
	substance_name?: string
	/** Mixture id. */
	mixture_id?: string
	/** Route of administration. */
	administratedBy: RouteOfAdministrationClassification
	/** Dosage. */
	dosage?: Dosage
	/** Substance. */
	Substance?: Substance
	/** Mixture. */
	Mixture?: Mixture
	/** Date of ingestion. */
	date?: Date
	/** Location of ingestion. */
	location?: string
	/** Notes about ingestion. */
	notes?: string

	private constructor(properties: IngestionProperties, id?: string) {
		super(id)
		this.substance_name = properties.substance_name
		this.mixture_id = properties.mixture_id
		this.administratedBy = properties.routeOfAdministration
		this.dosage = properties.dosage
		this.Substance = properties.Substance
		this.Mixture = properties.Mixture
		this.date = properties.date
		this.location = properties.location
		this.notes = properties.notes
	}

	/** Checks if ingestion contains information about ingested substance or mixture. If contains informations about mixture additionally checks if mixture contains information about it's content. */
	public hasSubstanceOrMixture(): boolean {
		return this.Substance !== undefined || this.Mixture !== undefined
	}

	public addSubstanceOrMixture(substanceOrMixture: Substance | Mixture): void {
		if (substanceOrMixture instanceof Substance) {
			this.Substance = substanceOrMixture
		} else {
			this.Mixture = substanceOrMixture
		}
	}

	static create(properties: IngestionProperties, id?: string): Ingestion {
		return new Ingestion(properties, id)
	}
}
