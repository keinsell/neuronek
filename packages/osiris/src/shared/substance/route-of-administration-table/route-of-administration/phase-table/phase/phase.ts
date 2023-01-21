import { PhaseClassification } from '../phase-classification.js'
import ms from 'ms'

export class Phase {
	public readonly minimalDuration?: number
	public readonly maximalDuration?: number

	constructor(duration: { minimalDuration?: number; maximalDuration?: number }) {
		this.minimalDuration = duration.minimalDuration
		this.maximalDuration = duration.maximalDuration
	}

	toString() {
		if (this.minimalDuration && this.maximalDuration) {
			return `${ms(this.minimalDuration)}-${ms(this.maximalDuration)}`
		}

		if (this.minimalDuration || this.maximalDuration) {
			return ms(this.minimalDuration || this.maximalDuration)
		}

		if (
			this.minimalDuration === this.maximalDuration &&
			this.minimalDuration !== undefined &&
			this.maximalDuration !== undefined
		) {
			return ms(this.minimalDuration)
		}

		return ''
	}

	/** Build a phase from human-readable format of string represented in `1h-2h` or `1h` if there is only one value. */
	static fromString(str: string) {
		if (str === undefined || str === null || str === '') {
			return new Phase({})
		}

		const parts = str.split('-').map(part => {
			return ms(part)
		})

		// If there is only one duration value in the string, return it.
		if (parts.length === 1) {
			return new Phase({ minimalDuration: parts[0], maximalDuration: parts[0] })
		}

		// If there are two duration values in the string, return both of them.
		// Check which one is the maximal duration and which one is the minimal duration.
		if (parts[0] < parts[1]) {
			return new Phase({ minimalDuration: parts[0], maximalDuration: parts[1] })
		} else {
			return new Phase({ minimalDuration: parts[1], maximalDuration: parts[0] })
		}
	}
}
