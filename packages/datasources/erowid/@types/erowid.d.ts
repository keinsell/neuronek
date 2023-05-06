export interface Report {
	id: number
	title: string
	date: Date
	author: Author
	dose?: (DoseEntity | null)[] | null
	report?: string[] | null
	erowid: Erowid
}
export interface Date {
	submission: string
	experience: string
}

export interface Author {
	name: string
	gender?: string | null
	weight?: number | null
	age?: number | null
}

export interface DoseEntity {
	time: string | number
	amount?: string | Amount
	administration?: string | null
	substance?: string | null
	form?: string | null
	specific?: string | null
}

export interface Amount {
	unit: string
	grams?: string | number
	quantity: string
}

export interface Erowid {
	id: string
	views: string
}

declare const dataset: Report[]

export default dataset
