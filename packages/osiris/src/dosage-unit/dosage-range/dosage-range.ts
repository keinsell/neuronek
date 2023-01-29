import { DosageUnit } from '../dosage-unit.js'

export class DosageRange {
	minimum: DosageUnit
	maximum: DosageUnit

	constructor(minimum: DosageUnit, maximum: DosageUnit) {
		Object.assign(this, { minimum, maximum })
	}

	toString(): string {
		return `${this.minimum.toString()} - ${this.maximum.toString()}`
	}
}
