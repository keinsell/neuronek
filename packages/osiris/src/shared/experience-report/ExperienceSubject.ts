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
}
