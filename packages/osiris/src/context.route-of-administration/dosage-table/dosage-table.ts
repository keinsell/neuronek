import { DosageClassification } from './dosage-classification.js'

// TODO: Probably refactor this class to use Dosage class
export class DosageTable {
	readonly kind: 'mass' | 'volume' | 'custom'
	readonly unit: string
	readonly isWeightBased?: boolean | undefined;
	readonly [DosageClassification.thereshold]: number;
	readonly [DosageClassification.light]: [number, number];
	readonly [DosageClassification.moderate]: [number, number];
	readonly [DosageClassification.strong]: [number, number];
	readonly [DosageClassification.heavy]: number

	private constructor(properties: {
		kind: 'mass' | 'volume' | 'custom'
		unit: string
		isWeightBased?: boolean | undefined
		[DosageClassification.thereshold]: number
		[DosageClassification.light]: [number, number]
		[DosageClassification.moderate]: [number, number]
		[DosageClassification.strong]: [number, number]
		[DosageClassification.heavy]: number
	}) {
		this.kind = properties.kind
		this.unit = properties.unit
		this.isWeightBased = properties.isWeightBased
		this[DosageClassification.thereshold] = properties[DosageClassification.thereshold]
		this[DosageClassification.light] = properties[DosageClassification.light]
		this[DosageClassification.moderate] = properties[DosageClassification.moderate]
		this[DosageClassification.strong] = properties[DosageClassification.strong]
		this[DosageClassification.heavy] = properties[DosageClassification.heavy]
	}

	static create(properties: {
		kind: 'mass' | 'volume' | 'custom'
		unit: string
		isWeightBased?: boolean | undefined
		[DosageClassification.thereshold]: number
		[DosageClassification.light]: [number, number]
		[DosageClassification.moderate]: [number, number]
		[DosageClassification.strong]: [number, number]
		[DosageClassification.heavy]: number
	}): DosageTable {
		return new DosageTable(properties)
	}
}
