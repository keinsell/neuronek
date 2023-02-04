import { _PhaseClassificationDescription, PhaseClassification } from './phase-classification.js'

export class Phase {
	public readonly classification: PhaseClassification
	public readonly minimalDuration?: number
	public readonly maximalDuration?: number

	private constructor(properties: {
		classification: PhaseClassification
		minimalDuration?: number
		maximalDuration?: number
	}) {
		this.classification = properties.classification
		this.minimalDuration = properties.minimalDuration
		this.maximalDuration = properties.maximalDuration
	}

	get description(): string {
		return _PhaseClassificationDescription[this.classification]
	}

	static create(properties: {
		classification: PhaseClassification
		minimalDuration?: number
		maximalDuration?: number
	}): Phase {
		return new Phase({
			...properties
		})
	}
}
