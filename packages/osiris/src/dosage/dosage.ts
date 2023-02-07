import Qty from 'js-quantities'
import unitmath from 'unitmath'
import { DosageForm } from './dosage-form.js'

export interface DosageProperties {
	amount: number
	unit: string
	form?: DosageForm
	purity?: number
	isEstimate?: boolean
}

export class Dosage {
	protected engine: Qty
	public amount: number
	public unit: string
	public form?: DosageForm
	public purity?: number
	/** This field should be marked if subject isn't sure about measured dosage, thus this should not be taken in exact calculations. */
	public isEstimate?: boolean

	constructor(properties: DosageProperties) {
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
