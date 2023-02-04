import { Ingestion } from '../ingestion/ingestion.js'

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
}
