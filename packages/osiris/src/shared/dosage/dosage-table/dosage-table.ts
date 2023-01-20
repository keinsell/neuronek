import { DosageClassification } from '../dosage-classification.js'
import { DosageUnit } from '../dosage-unit/dosage-unit.js'

/**
 * DosageTable is a class that holds infomration about dosage classification for specific substance or route of administration.
 */
export class DosageTable {
	protected _table: {
		[key in DosageClassification]?: DosageUnit
	}

	public getClassificationOfDosage(dosage: DosageUnit): DosageClassification {
		throw Error('Not implemented')
	}
}
