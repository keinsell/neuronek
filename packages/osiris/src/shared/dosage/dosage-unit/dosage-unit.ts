/** Represents single dosage value, for example `30mg` */
export class DosageUnit {
	/**
	 * baseScalar represents highest possible amount of mass (kilograms).
	 */
	public baseScalar: number

	constructor(baseScalar: number) {
		this.baseScalar = baseScalar
	}

	/** Converts value to string with attention to `baseScalar` - chooses best possible unit. */
	toString(): string {
		if (this.baseScalar < 0.000001) {
			return `${this.baseScalar / 0.000001}ug`
		}

		if (this.baseScalar < 0.001) {
			return `${this.baseScalar / 0.001}mg`
		}

		if (this.baseScalar < 1) {
			return `${this.baseScalar}g`
		}

		return `${this.baseScalar}kg`
	}

	static fromString(amount: string): DosageUnit {
		if (amount.endsWith('mg')) {
			return new DosageUnit(parseFloat(amount) * 0.001)
		}

		if (amount.endsWith('ug')) {
			return new DosageUnit(parseFloat(amount) * 0.000001)
		}

		if (amount.endsWith('g')) {
			return new DosageUnit(parseFloat(amount))
		}

		if (amount.endsWith('kg')) {
			return new DosageUnit(parseFloat(amount) * 1000)
		}

		throw new Error(`Invalid dosage unit provided: ${amount}`)
	}
}
