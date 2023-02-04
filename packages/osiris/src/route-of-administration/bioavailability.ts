import { ValueObject } from '../__core/valueobject.js'
import { ResearchPaper } from '../research-paper/research-paper.js'

export interface BioavailabilityProperties {
	minimal?: number
	maximal?: number
	citations?: ResearchPaper[]
}

export class Bioavailability extends ValueObject<BioavailabilityProperties> {}
