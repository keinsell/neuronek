import { Duration } from './duration/duration.js'
import { _PhaseClassificationDescription, PhaseClassification } from '../phase-classification.js'

export class Phase {
	public readonly classification: PhaseClassification
	public readonly minimalDuration?: Duration
	public readonly maximalDuration?: Duration

	private constructor(properties: {
		classification: PhaseClassification
		minimalDuration?: Duration
		maximalDuration?: Duration
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
		const minimalDuration =
			properties.minimalDuration === undefined ? undefined : Duration.fromNumber(properties.minimalDuration)
		const maximalDuration =
			properties.maximalDuration === undefined ? undefined : Duration.fromNumber(properties.maximalDuration)

		return new Phase({
			...properties,
			minimalDuration,
			maximalDuration
		})
	}
}
