import { DosageClassification } from '../dosage-classification.js'
import { DosageRange } from '../dosage-range/dosage-range.js'
import { Dosage } from '../dosage.js'

/**
 * DosageTable is a class that holds infomration about dosage classification for specific substance or route of administration.
 */
export class DosageTable {
	public readonly [DosageClassification.thereshold]?: DosageRange
	public readonly [DosageClassification.light]?: DosageRange
	public readonly [DosageClassification.moderate]?: DosageRange
	public readonly [DosageClassification.strong]?: DosageRange
	public readonly [DosageClassification.heavy]?: DosageRange

	constructor(
		dosageTable: Partial<{
			[key in DosageClassification]: DosageRange
		}>
	) {
		this[DosageClassification.thereshold] = dosageTable.thereshold
		this[DosageClassification.light] = dosageTable.light
		this[DosageClassification.moderate] = dosageTable.moderate
		this[DosageClassification.strong] = dosageTable.strong
		this[DosageClassification.heavy] = dosageTable.heavy
	}

	/** Method will compare provided dosage unit with available dosage table to find classification of provided dosage. */
	public getClassificationOfDosage(dosage: Dosage): DosageClassification {
		if (this[DosageClassification.heavy] && this[DosageClassification.heavy].isDosageWithinRange(dosage))
			return DosageClassification.heavy

		if (this[DosageClassification.strong] && this[DosageClassification.strong].isDosageWithinRange(dosage))
			return DosageClassification.strong

		if (this[DosageClassification.moderate] && this[DosageClassification.moderate].isDosageWithinRange(dosage))
			return DosageClassification.moderate

		if (this[DosageClassification.light] && this[DosageClassification.light].isDosageWithinRange(dosage))
			return DosageClassification.light

		if (this[DosageClassification.thereshold] && this[DosageClassification.thereshold].isDosageWithinRange(dosage))
			return DosageClassification.thereshold

		return DosageClassification.heavy
	}
}
