export interface SubjectProperties {
	first_name?: string
	last_name?: string
	username?: string
	birthday?: Date
	weight?: number
	height?: number
}

export class Subject {
	id: number
	first_name?: string
	last_name?: string
	username?: string
	birthday?: Date
	weight?: number
	height?: number

	private constructor(subject: SubjectProperties) {
		Object.assign(this, subject)
	}

	static async create(subject: SubjectProperties): Promise<Subject> {
		return new Subject(subject)
	}
}
