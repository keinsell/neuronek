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
