interface SubjectProperties {
	name?: string
	gender?: string
	age?: number
	birthdate?: Date
	weight?: number
	height?: number
	medications?: string[]
	mental_illness?: string[]
}

export interface SubjectJSON extends SubjectProperties {}

export class Subject implements SubjectProperties {
	name?: string
	gender?: string
	age?: number
	birthdate?: Date
	weight?: number
	height?: number
	medications?: string[]
	mental_illness?: string[]

	constructor(properties: SubjectProperties) {
		Object.assign(this, properties)
	}

	static fromObject(object: SubjectJSON): Subject {
		return new Subject(object)
	}

	toObject(): SubjectJSON {
		return { ...this }
	}
}
