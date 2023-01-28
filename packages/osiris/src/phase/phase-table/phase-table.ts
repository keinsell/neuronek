import { PhaseClassification } from './phase-classification.js'
import { Phase } from '../phase.js'

export type _PhaseTableJSON = {
	[key in PhaseClassification]?: string
}

export class PhaseTable {
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

	constructor(
		phaseTable: Partial<{
			[key in PhaseClassification]: Phase
		}>
	) {
		this[PhaseClassification.onset] = phaseTable.onset
		this[PhaseClassification.comeup] = phaseTable.comeup
		this[PhaseClassification.peak] = phaseTable.peak
		this[PhaseClassification.offset] = phaseTable.offset
		this[PhaseClassification.aftereffects] = phaseTable.aftereffects
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

	toJSON(): _PhaseTableJSON {
		const json: _PhaseTableJSON = {}

		for (const phase of this.phaseFunnel) {
			json[phase] = this[phase]?.toString()
		}

		return json
	}

	static fromJSON(json: _PhaseTableJSON): PhaseTable {
		// parse phases
		const phases = {}

		for (const phase of Object.keys(json)) {
			phases[phase] = Phase.fromString(json[phase])
		}

		// create PhaseTable instance
		return new PhaseTable(phases)
	}
}
