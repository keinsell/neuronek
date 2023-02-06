import Qty from 'js-quantities'
import unitmath from 'unitmath'

export class Dosage {
	protected engine: Qty
	public amount: number
	public unit: string
	public form?: 'crystal' | 'powder'
	public purity?: number

	constructor(properties: { amount: number; unit: string; form?: 'crystal' | 'powder'; purity?: number }) {
		const isProvidedUnitAvailable = Qty.getUnits().find(unit => unit === unit)
		let supportedUnit = isProvidedUnitAvailable ? this.unit : undefined

		if (supportedUnit === 'seeds') {
			supportedUnit = undefined
		}

		this.engine = Qty(properties.amount, supportedUnit)
	}

	/** Converts value to string with attention to `baseScalar`, function will find and use lowest possible unit relative to value. */
	toString(): string {
		if (this.engine.isUnitless()) {
			return `${this.engine.scalar} ${this.unit}`
		}

		// Convert the base scalar to the units of this quantity
		const qty = `${Qty(this.engine.scalar, this.engine.units()).toString()}`

		// Simplify the quantity and get the string representation
		const simplified = unitmath(qty).simplify().toString()

		// Parse the simplified quantity
		const parsed = Qty(simplified)

		// If the units are micrograms, return the unit as μg
		if (parsed.units() === 'ug') {
			return `${parsed.scalar} μg`
		}

		// Otherwise return the string representation of the parsed quantity
		return parsed.toString()
	}

	get scalar() {
		return this.engine.scalar
	}
}
