import Qty from 'js-quantities'
import pqm from 'pqm'
import unitmath from 'unitmath'

/** Represents single dosage value, for example `30mg` */
export class DosageUnit extends Qty {
	/**
	 * baseScalar represents highest possible amount of mass (kilograms).
	 */
	// public baseScalar: number

	/** Unit of value */
	// public unit: 'kg' | 'l'

	constructor(amount: number, unit: string) {
		super(amount, unit)
		// this.baseScalar = pqm.quantity(amount, unit)
		// this.unit = unit
	}

	/** Converts value to string with attention to `baseScalar`, function will find and use lowest possible unit relative to value. */
	toString(): string {
		const qty = `${Qty(this.baseScalar, this.units()).toString()}`

		const simplified = unitmath(qty).simplify().toString()
		const parsed = Qty(simplified)

		if (parsed.units() === 'ug') {
			return `${parsed.scalar} μg`
		}

		if (parsed.units() === 'cm3') {
			return `${parsed.scalar} l`
		}

		return parsed.toString()
	}

	static fromString(string: string): DosageUnit {
		const baseScalarOfUnit = new Qty(string).toBase()
		const unit = baseScalarOfUnit.units()
		const value = baseScalarOfUnit.scalar
		return new DosageUnit(value, unit)
	}
}
