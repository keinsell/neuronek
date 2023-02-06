import { Substance } from '../substance/substance.js'

export class MixtureIngredient {
	substance_name: string
	dosage: number
	dosage_unit: string
	Substance?: Substance

	private constructor({ substance_name, dosage, dosage_unit, Substance }: MixtureIngredient) {
		this.substance_name = substance_name
		this.dosage = dosage
		this.dosage_unit = dosage_unit
		this.Substance = Substance
	}
}
