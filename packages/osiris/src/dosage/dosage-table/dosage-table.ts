import { DosageClassification } from '../dosage-classification.js'
import { DosageRange } from '../dosage-range/dosage-range.js'
import { Dosage } from '../dosage.js'

export type _DosageTableJSON = {
	[key in DosageClassification]?: string
}

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

	toJSON(): _DosageTableJSON {
		return {
			thereshold: this.thereshold?.toString(),
			light: this.light?.toString(),
			moderate: this.moderate?.toString(),
			strong: this.strong?.toString(),
			heavy: this.heavy?.toString()
		}
	}

	static fromJSON(json: _DosageTableJSON): DosageTable {
		return new DosageTable({
			thereshold: json.thereshold ? DosageRange.fromString(json.thereshold) : undefined,
			light: json.light ? DosageRange.fromString(json.light) : undefined,
			moderate: json.moderate ? DosageRange.fromString(json.moderate) : undefined,
			strong: json.strong ? DosageRange.fromString(json.strong) : undefined,
			heavy: json.heavy ? DosageRange.fromString(json.heavy) : undefined
		})
	}
}
