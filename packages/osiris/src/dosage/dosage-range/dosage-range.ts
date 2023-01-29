import { Dosage } from '../dosage.js'

export class DosageRange {
	minimum: Dosage
	maximum: Dosage

	constructor(minimum: Dosage, maximum: Dosage) {
		Object.assign(this, { minimum, maximum })
	}

	toString(): string {
		return `${this.minimum.toString()} - ${this.maximum.toString()}`
	}
}
