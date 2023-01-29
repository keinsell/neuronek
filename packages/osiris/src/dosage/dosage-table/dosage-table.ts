import { DosageClassification } from '../dosage-classification.js'
import { Dosage } from '../dosage.js'

export type _DosageTableJSON = {
	[key in DosageClassification]?: string
}

/**
 * DosageTable is a class that holds infomration about dosage classification for specific substance or route of administration.
 */
export class DosageTable {
	public readonly [DosageClassification.thereshold]?: Dosage
	public readonly [DosageClassification.light]?: Dosage
	public readonly [DosageClassification.moderate]?: Dosage
	public readonly [DosageClassification.strong]?: Dosage
	public readonly [DosageClassification.heavy]?: Dosage

	constructor(
		dosageTable: Partial<{
			[key in DosageClassification]: Dosage
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
			thereshold: json.thereshold ? Dosage.fromString(json.thereshold) : undefined,
			light: json.light ? Dosage.fromString(json.light) : undefined,
			moderate: json.moderate ? Dosage.fromString(json.moderate) : undefined,
			strong: json.strong ? Dosage.fromString(json.strong) : undefined,
			heavy: json.heavy ? Dosage.fromString(json.heavy) : undefined
		})
	}
}
