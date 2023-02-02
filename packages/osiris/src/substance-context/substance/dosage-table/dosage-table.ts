import { ValueObject } from '../../../common/value-object/value-object.js'
import { DosageClassification } from '../../../ingestion-context/dosage/dosage-classification.js'

export interface DosageTableProperties {
	readonly kind: 'mass' | 'volume' | 'custom'
	readonly unit: string
	readonly isWeightBased?: boolean | undefined
	readonly [DosageClassification.thereshold]: number
	readonly [DosageClassification.light]: [number, number]
	readonly [DosageClassification.moderate]: [number, number]
	readonly [DosageClassification.strong]: [number, number]
	readonly [DosageClassification.heavy]: number
}

// TODO: DosageTable should have feature to compare given dosage to each dosage classification
export class DosageTable extends ValueObject<DosageTableProperties> {
	constructor(properties: DosageTableProperties) {
		super(properties)
	}

	toJSON(): DosageTableProperties {
		return this.properties
	}

	static fromJSON(json: DosageTableProperties): DosageTable {
		return new DosageTable(json)
	}
}
