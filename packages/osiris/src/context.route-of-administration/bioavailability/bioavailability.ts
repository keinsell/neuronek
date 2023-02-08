import { ResearchPaper } from '../../context.research/research-paper/research-paper.js'

export interface BioavailabilityProperties {
	minimal?: number
	maximal?: number
	citations?: ResearchPaper[]
}

export class Bioavailability {
	minimal?: number
	maximal?: number
	citations?: ResearchPaper[]

	private constructor(properties: BioavailabilityProperties) {
		Object.assign(this, properties)
	}

	static create(properties: BioavailabilityProperties) {
		return new Bioavailability(properties)
	}
}
