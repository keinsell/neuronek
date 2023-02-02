export interface ExperienceSubjectProperties {
	name?: string
	gender?: string
	age?: number
	birthdate?: Date
	weight?: number
	height?: number
	medications?: string[]
	mental_illness?: string[]
}

export class ExperienceSubject implements ExperienceSubjectProperties {
	name?: string
	gender?: string
	age?: number
	birthdate?: Date
	weight?: number
	height?: number
	medications?: string[]
	mental_illness?: string[]

	constructor(properties: ExperienceSubjectProperties) {
		Object.assign(this, properties)
	}

	static fromObject(object: ExperienceSubjectProperties): ExperienceSubject {
		return new ExperienceSubject(object)
	}

	toObject(): ExperienceSubjectProperties {
		return { ...this }
	}
}
