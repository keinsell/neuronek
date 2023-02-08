import { PhaseClassification } from './phase-classification.js'
import { Phase } from './phase/phase.js'

export class PhaseTable {
	public readonly [PhaseClassification.onset]?: Phase
	public readonly [PhaseClassification.comeup]?: Phase
	public readonly [PhaseClassification.peak]?: Phase
	public readonly [PhaseClassification.offset]?: Phase
	public readonly [PhaseClassification.aftereffects]?: Phase

	private constructor(properties: {
		[classification in PhaseClassification]?: Phase
	}) {
		Object.assign(this, properties)
	}

	static fromMultiplePhases(...items: Phase[]): PhaseTable {
		const properties: Record<string, Phase> = {}

		for (const phase of items) {
			properties[phase.classification] = phase
		}

		return new PhaseTable(properties)
	}
}
