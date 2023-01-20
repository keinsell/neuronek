import { DosageClassification } from '../dosage-classification.js'
import { DosageUnit } from '../dosage-unit/dosage-unit.js'

/**
 * DosageTable is a class that holds infomration about dosage classification for specific substance or route of administration.
 */
export class DosageTable {
	public readonly [DosageClassification.thereshold]?: DosageUnit
	public readonly [DosageClassification.light]?: DosageUnit
	public readonly [DosageClassification.moderate]?: DosageUnit
	public readonly [DosageClassification.strong]?: DosageUnit
	public readonly [DosageClassification.heavy]?: DosageUnit

	constructor(
		dosageTable: Partial<{
			[key in DosageClassification]: DosageUnit
		}>
	) {
		this[DosageClassification.thereshold] = dosageTable.thereshold
		this[DosageClassification.light] = dosageTable.light
		this[DosageClassification.moderate] = dosageTable.moderate
		this[DosageClassification.strong] = dosageTable.strong
		this[DosageClassification.heavy] = dosageTable.heavy
	}

	/** Method will compare provided dosage unit with available dosage table to find classification of provided dosage. */
	public getClassificationOfDosage(dosage: DosageUnit): DosageClassification {
		if (this[DosageClassification.heavy] && dosage.gte(this[DosageClassification.heavy]))
			return DosageClassification.heavy

		if (
			this[DosageClassification.strong] &&
			dosage.gte(this[DosageClassification.strong]) &&
			dosage.lt(this[DosageClassification.heavy])
		)
			return DosageClassification.strong

		if (
			this[DosageClassification.moderate] &&
			dosage.gte(this[DosageClassification.moderate]) &&
			dosage.lt(this[DosageClassification.strong])
		)
			return DosageClassification.moderate

		if (
			this[DosageClassification.light] &&
			dosage.gte(this[DosageClassification.light]) &&
			dosage.lt(this[DosageClassification.moderate])
		)
			return DosageClassification.light

		if (this[DosageClassification.thereshold] && dosage.lte(this[DosageClassification.thereshold]))
			return DosageClassification.thereshold
	}
}
