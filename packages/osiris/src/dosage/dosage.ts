import Qty from 'js-quantities'
import unitmath from 'unitmath'

export interface DosageProperties {
	isDosagePerKilogramOfBodyWeight?: boolean
	form?: 'crystal' | 'powder'
	purity?: number
	unsupportedUnit?: string
}

export interface DosageJSON {
	baseScalar: number
	kind: 'mass' | 'volume' | 'custom'
	isDosagePerKilogramOfBodyWeight?: boolean
	unit?: string
	string: string
}

// This function is used to convert a dosage unit to a string, while also simplifying the unit
// If the unit is ug then the value will be converted to μg
// If the unit is cm3 then the value will be converted to l
// This function will also find the lowest possible unit relative to the value
export class Dosage extends Qty implements DosageProperties {
	warnings: string[] = []
	isDosagePerKilogramOfBodyWeight?: boolean = false
	form?: 'crystal' | 'powder'
	purity?: number
	unsupportedUnit?: string

	constructor(amount: number, unit: string, additionalProperties?: DosageProperties) {
		const isProvidedUnitAvailable = Qty.getUnits().find(unit => unit === unit)
		let supportedUnit = isProvidedUnitAvailable ? unit : undefined
		let unsupportedUnit: string | undefined

		if (supportedUnit === 'seeds') {
			supportedUnit = undefined
			unsupportedUnit = 'seeds'
		}

		super(amount, supportedUnit)

		// Set a custom unit if provided unit is not a known unit
		this.unsupportedUnit = unsupportedUnit
		this.getAnalisis()

		// Set additional properties
		this.isDosagePerKilogramOfBodyWeight = additionalProperties?.isDosagePerKilogramOfBodyWeight || false
	}

	getAnalisis() {
		if (!this.form) {
			this.warnings.push('Dosage is missing form information.')
		}

		if (!this.purity) {
			this.warnings.push('Dosage is missing purity.')
		}
	}

	/** Converts value to string with attention to `baseScalar`, function will find and use lowest possible unit relative to value. */
	toString(): string {
		if (this.isUnitless()) {
			return `${this.scalar} ${this.unsupportedUnit}`
		}

		// Convert the base scalar to the units of this quantity
		const qty = `${Qty(this.scalar, this.units()).toString()}`

		// Simplify the quantity and get the string representation
		const simplified = unitmath(qty).simplify().toString()

		// Parse the simplified quantity
		const parsed = Qty(simplified)

		// If the units are micrograms, return the unit as μg
		if (parsed.units() === 'ug') {
			return `${parsed.scalar} μg`
		}

		// if (this.isDosagePerKilogramOfBodyWeight) {
		// 	return `${parsed.toString()}/kg of body weight`
		// }

		// Otherwise return the string representation of the parsed quantity
		return parsed.toString()
	}

	/** This function converts a string to a Dosage by converting the string to a base scalar and unitand then returning a new Dosage with the scalar and unit as the value and unit respectively. */
	static fromString(string: string): Dosage {
		const baseScalarOfUnit = new Qty(string).toBase()
		const unit = baseScalarOfUnit.units()
		const value = baseScalarOfUnit.scalar
		// Return the dosage unit
		return new Dosage(value, unit)
	}

	toJSON(): DosageJSON {
		return {
			baseScalar: this.toBase().scalar,
			kind: this.unsupportedUnit ? 'custom' : (this.kind() as any),
			isDosagePerKilogramOfBodyWeight: this.isDosagePerKilogramOfBodyWeight || false,
			string: this.toString(),
			unit: this.unsupportedUnit ? this.unsupportedUnit : this.toBase().units()
		}
	}

	static fromJSON(json: DosageJSON): Dosage {
		return new Dosage(json.baseScalar, json.unit, {
			isDosagePerKilogramOfBodyWeight: json.isDosagePerKilogramOfBodyWeight,
			unsupportedUnit: json.kind === 'custom' ? json.unit : undefined
		})
	}
}
