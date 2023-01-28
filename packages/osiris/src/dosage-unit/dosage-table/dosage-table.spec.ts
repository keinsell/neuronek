import ava, { TestFn } from 'ava'
import { DosageClassification } from '../dosage-classification.js'
import { DosageUnit } from '../dosage-unit.js'
import { DosageTable } from './dosage-table.js'

const test = ava as TestFn<{
	dosageTable: {
		[dosage in DosageClassification]: DosageUnit
	}
}>

test.beforeEach(t => {
	t.context.dosageTable = {
		thereshold: new DosageUnit(0.5, 'mg'),
		light: new DosageUnit(0.75, 'mg'),
		moderate: new DosageUnit(1, 'mg'),
		strong: new DosageUnit(1.5, 'mg'),
		heavy: new DosageUnit(2, 'mg')
	}
})

test('getClassificationOfDosage(): should return dosage classification', t => {
	const dosageTable = new DosageTable(t.context.dosageTable)

	for (const value of Object.values(DosageClassification)) {
		const dosage = t.context.dosageTable[value]

		t.is(
			dosageTable.getClassificationOfDosage(dosage),
			value,
			`Dosage classification of ${dosage.toString()} should be ${value}`
		)
	}
})

test('toJSON(): should return JSONed data', t => {
	const dosageTable = new DosageTable(t.context.dosageTable)

	const exprected = {}

	for (const classification of Object.keys(DosageClassification)) {
		exprected[classification] = t.context.dosageTable[classification]?.toString()
	}

	t.deepEqual(dosageTable.toJSON(), exprected)
})

test('fromJSON(): should return dosage table from JSON', t => {
	const json = {}

	for (const classification of Object.keys(DosageClassification)) {
		json[classification] = t.context.dosageTable[classification]?.toString()
	}

	const dosageTable = DosageTable.fromJSON(json)

	t.deepEqual(dosageTable.toJSON(), json)
})
