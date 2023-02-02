import { ResearchPaper, ResearchPaperJSON } from '../../../../research-paper/research-paper.js'

export interface BioavailabilityProperties {
	minimal?: number
	maximal?: number
	citations?: ResearchPaper[]
}

export interface BioavailabilityJSON {
	minimal?: number
	maximal?: number
	citations?: ResearchPaperJSON[]
}

export class Bioavailability implements BioavailabilityProperties {
	minimal?: number
	maximal?: number
	citations?: ResearchPaper[]

	constructor(properties: BioavailabilityProperties) {
		Object.assign(this, properties)
	}

	toJSON(): BioavailabilityJSON {
		return {
			maximal: this.maximal,
			minimal: this.minimal,
			citations: this.citations ? this.citations?.map(citation => citation?.toJSON()) : undefined
		}
	}

	static fromJSON(json: BioavailabilityJSON): Bioavailability {
		return new Bioavailability({
			maximal: json.maximal ? json.maximal : undefined,
			minimal: json.minimal ? json.minimal : undefined,
			citations: json.citations ? json.citations?.map(citation => ResearchPaper?.fromJSON(citation)) : undefined
		})
	}
}
