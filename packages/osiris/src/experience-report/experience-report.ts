import { Effect } from '../effect/effect.js'
import { Ingestion, IngestionProperties } from '../ingestion/ingestion.js'
import { ExperienceStageTable } from './ExperienceStageTable.js'
import { Subject } from './ExperienceSubject.js'

interface ExperienceReportProperties {
	title?: string
	subject?: Subject
	ingestions?: Ingestion[]
	experienceDate?: Date
	submissionDate?: Date
	phases?: ExperienceStageTable
	raw_content?: string[]
	conclusion?: string
	effects?: Effect[]
	location?: string
}

export class ExperienceReport implements ExperienceReportProperties {
	title?: string
	subject?: Subject
	ingestions?: Ingestion[]
	experienceDate?: Date
	submissionDate?: Date
	phases?: ExperienceStageTable
	raw_content?: string[]
	conclusion?: string
	effects?: Effect[]
	location?: string

	constructor(properties: ExperienceReportProperties) {
		Object.assign(this, properties)
	}
}
