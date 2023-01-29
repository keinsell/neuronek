import { Dosage } from '../dosage.js'

export class DosageRange {
	minimum?: Dosage
	maximum?: Dosage

	constructor(minimum?: Dosage, maximum?: Dosage) {
		Object.assign(this, { minimum, maximum })
	}

	toString(): string {
		return `${this.minimum.toString()} - ${this.maximum.toString()}`
	}

	static fromString(dosageString: string): DosageRange {
		const [minimumString, maximumString] = dosageString.split(' - ')
		const minimum = Dosage.fromString(minimumString)
		const maximum = Dosage.fromString(maximumString)
		const dosageRange = new DosageRange(minimum, maximum)
		return dosageRange
	}

	isDosageWithinRange(dosage: Dosage): boolean {
		if (this.minimum && !this.maximum) {
			return dosage.baseScalar >= this.minimum.baseScalar
		}
		if (this.maximum && !this.minimum) {
			return dosage.baseScalar <= this.maximum.baseScalar
		} else {
			return dosage.baseScalar >= this.minimum.baseScalar && dosage.baseScalar <= this.maximum.baseScalar
		}
	}
}
