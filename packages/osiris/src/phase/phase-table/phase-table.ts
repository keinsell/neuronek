import { PhaseClassification } from './phase-classification.js'
import { Phase, PhaseJSON } from '../phase.js'

export type PhaseTableProperties = {
	[key in PhaseClassification]?: Phase
}

export type PhaseTableJSON = PhaseJSON & { classification: PhaseClassification }[]
export class PhaseTable implements PhaseTableProperties {
	public readonly [PhaseClassification.onset]?: Phase
	public readonly [PhaseClassification.comeup]?: Phase
	public readonly [PhaseClassification.peak]?: Phase
	public readonly [PhaseClassification.offset]?: Phase
	public readonly [PhaseClassification.aftereffects]?: Phase

	/** Represents order of phases, starting up at `onset` and ending at `aftereffects` */
	protected readonly phaseFunnel = [
		PhaseClassification.onset,
		PhaseClassification.comeup,
		PhaseClassification.peak,
		PhaseClassification.offset,
		PhaseClassification.aftereffects
	]

	constructor(properties: PhaseTableProperties) {
		Object.assign(this, properties)
	}

	/** Get total duration of effects, this excludes aftereffects. */
	get totalDuration(): Phase {
		const phasesConsideredForTotalDuration: Phase[] = [
			this[PhaseClassification.onset],
			this[PhaseClassification.comeup],
			this[PhaseClassification.peak],
			this[PhaseClassification.offset]
		]

		// Calculate minimal duration of effects
		const minimalDuration = phasesConsideredForTotalDuration
			.map(phase => phase?.minimalDuration)
			.reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0)

		// Calculate maximal duration of effects
		const maximalDuration = phasesConsideredForTotalDuration
			.map(phase => phase?.maximalDuration)
			.reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0)

		// Create Phase instance
		return new Phase({ minimalDuration, maximalDuration })
	}

	/** Get time needed to get into specific phase */
	calculateTimeToStartOfPhase(phase: PhaseClassification): Phase {
		let minimalTime = 0
		let maximalTime = 0

		for (const funnelPhase of this.phaseFunnel) {
			if (funnelPhase === phase) break

			minimalTime += this[funnelPhase]?.minimalDuration ?? 0
			maximalTime += this[funnelPhase]?.maximalDuration ?? 0
		}

		return new Phase({ minimalDuration: minimalTime, maximalDuration: maximalTime })
	}

	/** Get time needed to get out of specific phase */
	calculateTimeToEndOfPhase(phase: PhaseClassification): Phase {
		const timeToStartOfPhase = this.calculateTimeToStartOfPhase(phase)
		const durationOfPhase = this[phase]

		const timeToEndOfPhase = new Phase({
			minimalDuration: timeToStartOfPhase.minimalDuration + (durationOfPhase?.minimalDuration ?? 0),
			maximalDuration: timeToStartOfPhase.maximalDuration + (durationOfPhase?.maximalDuration ?? 0)
		})

		return timeToEndOfPhase
	}

	get all(): { phase?: Phase; classification: PhaseClassification }[] {
		const phases = [
			{ phase: this.onset, classification: PhaseClassification.onset },
			{ phase: this.comeup, classification: PhaseClassification.comeup },
			{ phase: this.peak, classification: PhaseClassification.peak },
			{ phase: this.offset, classification: PhaseClassification.offset },
			{ phase: this.aftereffects, classification: PhaseClassification.aftereffects }
		]

		return phases
	}

	toJSON(): PhaseTableJSON {
		const json: PhaseTableJSON = []

		for (const phase of this.all) {
			json[phase.classification] = phase.phase?.toJSON ?? null
		}

		return json
	}

	static fromJSON(json: PhaseTableJSON): PhaseTable {
		// parse phases
		const phases = {}

		for (const phase of Object.keys(json)) {
			phases[phase] = Phase.fromJSON(json[phase])
		}

		// create PhaseTable instance
		return new PhaseTable(phases)
	}
}
