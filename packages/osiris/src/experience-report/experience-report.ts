import { Effect } from '../effect/effect.js'
import { Ingestion } from '../ingestion/ingestion.js'
import { ExperienceStageTable } from './ExperienceStageTable.js'
import { Subject, SubjectJSON } from './ExperienceSubject.js'

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

interface ExperienceReportJSON {
	title?: string
	subject?: SubjectJSON
	experienceDate?: Date
	submissionDate?: Date
	raw_content?: string[]
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

	static fromJSON(object: ExperienceReportJSON): ExperienceReport {
		return new ExperienceReport({ ...object, subject: object.subject ? Subject.fromObject(object.subject) : undefined })
	}

	toJSON(): ExperienceReportJSON {
		return { ...this }
	}
}
