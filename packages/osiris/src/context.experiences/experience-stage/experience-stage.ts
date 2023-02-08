import { Effect } from '../../context.effect/effect.js'

export interface ExperienceStageProperties {
	time?: string
	content?: string[]
	effects?: Effect[]
}

export class ExperienceStage implements ExperienceStageProperties {
	time?: string
	content?: string[]
	effects?: Effect[]

	constructor(properties: ExperienceStageProperties) {
		Object.assign(this, properties)
	}
}
