import { Dosage } from '../../context.ingestion/dosage/dosage.js'
import { Substance } from '../../context.substance/substance.js'

export class MixtureIngredient {
	substance_name: string
	dosage: Dosage
	Substance?: Substance

	private constructor(intrigent: { substance_name: string; dosage: Dosage }) {
		this.substance_name = intrigent.substance_name
		this.dosage = intrigent.dosage
	}

	static async create(intrigent: { substance_name: string; dosage: Dosage }): Promise<MixtureIngredient> {
		return new MixtureIngredient(intrigent)
	}
}
