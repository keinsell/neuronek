import { Effect } from '../effect/effect.js'
import { IngestionProperties } from '../ingestion/ingestion.js'
import { ExperienceStage } from './ExperienceStage.js'
import { ExperienceStageTable } from './ExperienceStageTable.js'

export interface SubjectProperties {
	name?: string
	gender?: string
	age?: number
	birthdate?: Date
	weight?: number
	height?: number
	medications?: string[]
	mental_illness?: string[]
}

interface ExperienceReportProperties {
	title?: string
	subject?: SubjectProperties
	ingestions?: IngestionProperties[]
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
	subject?: SubjectProperties
	ingestions?: IngestionProperties[]
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
