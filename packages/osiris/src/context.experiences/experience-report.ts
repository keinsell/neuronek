import { Effect } from '../context.effect/effect.js'
import { Ingestion } from '../context.ingestion/ingestion.js'
import { ExperienceStageTable } from './experience-stage/experience-stagle-table/experience-stage-table.js'
import { ExperienceSubject, ExperienceSubjectProperties } from './experience-subject/experience-subject.js'

interface ExperienceReportProperties {
	title?: string
	subject?: ExperienceSubject
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
	subject?: ExperienceSubjectProperties
	experienceDate?: Date
	submissionDate?: Date
	raw_content?: string[]
}

export class ExperienceReport implements ExperienceReportProperties {
	title?: string
	subject?: ExperienceSubject
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
		return new ExperienceReport({
			...object,
			subject: object.subject ? ExperienceSubject.fromObject(object.subject) : undefined
		})
	}

	toJSON(): ExperienceReportJSON {
		return { ...this }
	}
}
