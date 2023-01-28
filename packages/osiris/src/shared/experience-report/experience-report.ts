import { Effect } from '../effect/effect.js'
import { IngestionProperties } from '../ingestion/ingestion.js'

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

export interface PhaseParagraphProperties {
	time?: string
	content: string[]
	effects?: Effect[]
}
export interface PhaseParaphraphTableProperites {
	/** Start of experience which would include onset and comeup. */
	onset?: PhaseParagraphProperties
	/** Middle of experience which would include plateau and peak. */
	peak?: PhaseParagraphProperties
	/** Ending of experience which would include offset and aftereffects. */
	offset?: PhaseParagraphProperties
}

export interface ExperienceReportProperties {
	title?: string
	subject?: SubjectProperties
	ingestions?: IngestionProperties[]
	experienceDate?: Date
	submissionDate?: Date
	phases?: PhaseParaphraphTableProperites
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
	phases?: PhaseParaphraphTableProperites
	raw_content?: string[]
	conclusion?: string
	effects?: Effect[]
	location?: string

	constructor(properties: ExperienceReportProperties) {
		Object.assign(this, properties)
	}
}
