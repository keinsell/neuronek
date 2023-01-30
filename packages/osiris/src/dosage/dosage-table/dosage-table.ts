import { DosageClassification } from '../dosage-classification.js'

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

export interface DosageTableJSON extends DosageTableProperties {}

export class DosageTable implements DosageTableProperties {
	readonly kind: 'mass' | 'volume' | 'custom'
	readonly unit: string
	readonly isWeightBased?: boolean | undefined;
	readonly [DosageClassification.thereshold]: number;
	readonly [DosageClassification.light]: [number, number];
	readonly [DosageClassification.moderate]: [number, number];
	readonly [DosageClassification.strong]: [number, number];
	readonly [DosageClassification.heavy]: number

	constructor(properties: DosageTableProperties) {
		this.kind = properties.kind
		this.unit = properties.unit
		this.isWeightBased = properties.isWeightBased
		this[DosageClassification.thereshold] = properties[DosageClassification.thereshold]
		this[DosageClassification.light] = properties[DosageClassification.light]
		this[DosageClassification.moderate] = properties[DosageClassification.moderate]
		this[DosageClassification.strong] = properties[DosageClassification.strong]
		this[DosageClassification.heavy] = properties[DosageClassification.heavy]
	}

	toJSON(): DosageTableJSON {
		return {
			...this
		}
	}

	static fromJSON(json: DosageTableJSON): DosageTable {
		return new DosageTable(json)
	}
}
