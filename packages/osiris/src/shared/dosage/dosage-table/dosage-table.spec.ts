import test from 'ava'
import { DosageClassification } from '../dosage-classification.js'
import { DosageUnit } from '../dosage-unit/dosage-unit.js'
import { DosageTable } from './dosage-table.js'

test('getClassificationOfDosage(): should return dosage classification', t => {
	const dosageTable = new DosageTable({
		thereshold: new DosageUnit(0.5, 'mg'),
		light: new DosageUnit(0.75, 'mg'),
		moderate: new DosageUnit(1, 'mg'),
		strong: new DosageUnit(1.5, 'mg'),
		heavy: new DosageUnit(2, 'mg')
	})

	const expectedClassifications: { dosage: DosageUnit; expectedClassification: DosageClassification }[] = [
		{ dosage: new DosageUnit(0.25, 'mg'), expectedClassification: DosageClassification.thereshold },
		{ dosage: new DosageUnit(0.5, 'mg'), expectedClassification: DosageClassification.thereshold },
		{ dosage: new DosageUnit(0.75, 'mg'), expectedClassification: DosageClassification.light },
		{ dosage: new DosageUnit(1, 'mg'), expectedClassification: DosageClassification.moderate },
		{ dosage: new DosageUnit(1.5, 'mg'), expectedClassification: DosageClassification.strong },
		{ dosage: new DosageUnit(2, 'mg'), expectedClassification: DosageClassification.heavy },
		{ dosage: new DosageUnit(2.5, 'mg'), expectedClassification: DosageClassification.heavy }
	]

	for (const { dosage, expectedClassification } of expectedClassifications) {
		t.is(
			dosageTable.getClassificationOfDosage(dosage),
			expectedClassification,
			`Dosage ${dosage.toString()} should be ${expectedClassification} according to table.`
		)
	}
})

test('toJSON(): should return JSONed data', t => {
	const dosageTable = new DosageTable({
		thereshold: new DosageUnit(0.5, 'mg'),
		light: new DosageUnit(0.75, 'mg'),
		moderate: new DosageUnit(1, 'mg'),
		strong: new DosageUnit(1.5, 'mg'),
		heavy: new DosageUnit(2, 'mg')
	})

	t.deepEqual(dosageTable.toJSON(), {
		thereshold: '0.5 mg',
		light: '0.75 mg',
		moderate: '1 mg',
		strong: '1.5 mg',
		heavy: '2 mg'
	})
})

test('fromJSON(): should return dosage table from JSON', t => {
	const dosageTable = DosageTable.fromJSON({
		thereshold: '0.5 mg',
		light: '0.75 mg',
		moderate: '1 mg',
		strong: '1.5 mg'
	})

	t.deepEqual(dosageTable.toJSON(), {
		thereshold: '0.5 mg',
		light: '0.75 mg',
		moderate: '1 mg',
		strong: '1.5 mg',
		heavy: undefined
	})
})
