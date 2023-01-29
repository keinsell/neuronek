import { DosageClassification } from '../dosage-classification.js'
import { DosageRange, DosageRangeJSON } from '../dosage-range/dosage-range.js'
import { Dosage } from '../dosage.js'

export type DosageTableProperties = {
	[key in DosageClassification]?: DosageRange
}

export type DosageTableJSON = {
	[key in DosageClassification]?: DosageRangeJSON
}

/**
 * DosageTable is a class that holds infomration about dosage classification for specific substance or route of administration.
 */
export class DosageTable implements DosageTableProperties {
	public readonly [DosageClassification.thereshold]?: DosageRange
	public readonly [DosageClassification.light]?: DosageRange
	public readonly [DosageClassification.moderate]?: DosageRange
	public readonly [DosageClassification.strong]?: DosageRange
	public readonly [DosageClassification.heavy]?: DosageRange

	constructor(properties: DosageTableProperties) {
		Object.assign(this, properties)
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

	get all(): { dosage: DosageRange; classification: DosageClassification }[] {
		const all: { dosage: DosageRange; classification: DosageClassification }[] = []

		for (const key of Object.keys(this)) {
			const classification = key as DosageClassification
			const dosageRange = this[classification]

			if (dosageRange !== undefined) {
				all.push({ dosage: dosageRange, classification })
				all.push({ dosage: dosageRange, classification })
			}
		}

		return all
	}

	public toJSON(): DosageTableJSON {
		const json: DosageTableJSON = {}

		for (const key of this.all) {
			json[key.classification] = key.dosage?.toJSON()
		}

		return json
	}

	public static fromJSON(json: DosageTableJSON): DosageTable {
		const dosageTable = {}

		for (const key of Object.keys(json)) {
			dosageTable[key] = DosageRange.fromJSON(json[key])
		}

		return new DosageTable(dosageTable)
	}
}
