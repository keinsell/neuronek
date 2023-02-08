import { Ingestion } from '../context.ingestion/ingestion.js'
import { PsychoactiveClassification } from '../context.substance/psychoactive-class/psychoactive-classification.js'
import * as R from 'ramda'

export interface JournalFilters {
	psychoactiveGroup?: {
		in?: PsychoactiveClassification[]
		is?: PsychoactiveClassification
	}
}

// TODO: Add support for filtering by substances, route of administration, etc. (https://github.com/keinsell/neuronek/issues/340)
export class Journal {
	public started_at: Date
	public ended_at: Date

	private constructor(private ingestions: Ingestion[]) {
		// Find the lowest possible data from available ingestions
		const first_ingestion = this.ingestions.reduce((acc, val) => (acc.date < val.date ? acc : val))
		this.started_at = first_ingestion.date

		// Find the highest possible date from available ingestions
		const last_ingestion = this.ingestions.reduce((acc, val) => (acc.date > val.date ? acc : val))
		this.ended_at = last_ingestion.date
	}

	static create(ingestions: Ingestion[]) {
		return new Journal(ingestions)
	}

	public filter(by: JournalFilters) {}

	/** Calculates average dosage from all provided ingestions, sadly it doesn't support mixed dosages (volumetric and mass) and in this case zero will be returned. */
	public average_dosage() {}
}
