import { Dosage, DosageJSON } from '../dosage.js'

export interface DosageRangeProperties {
	minimum?: Dosage
	maximum?: Dosage
}

export interface DosageRangeJSON {
	minimum?: DosageJSON
	maximum?: DosageJSON
}

export class DosageRange implements DosageRangeProperties {
	minimum?: Dosage
	maximum?: Dosage

	constructor(minimum?: Dosage, maximum?: Dosage) {
		Object.assign(this, { minimum, maximum })
	}

	toString(): string {
		if (this.minimum && !this.maximum) {
			return this.minimum.toString()
		}

		if (this.maximum && !this.minimum) {
			return this.maximum.toString()
		}

		return `${this.minimum.toString()} - ${this.maximum.toString()}`
	}

	static fromString(dosageString: string): DosageRange {
		const [minimumString, maximumString] = dosageString.split(' - ')

		if (minimumString && !maximumString) {
			const dosage = Dosage.fromString(minimumString)
			return new DosageRange(dosage, undefined)
		}

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

	toJSON(): DosageRangeJSON {
		return {
			minimum: this.minimum?.toJSON(),
			maximum: this.maximum?.toJSON()
		}
	}

	static fromJSON(dosageRangeJSON: DosageRangeJSON): DosageRange {
		return new DosageRange(
			dosageRangeJSON.minimum && Dosage.fromJSON(dosageRangeJSON.minimum),
			dosageRangeJSON.maximum && Dosage.fromJSON(dosageRangeJSON.maximum)
		)
	}
}
