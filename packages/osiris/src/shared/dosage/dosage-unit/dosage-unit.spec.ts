import ava from 'ava'
import { DosageUnit } from './dosage-unit.js'

ava('fromString(): should create a dosage unit with baseScalar', t => {
	const inputAndExpected = [
		['1ug', 1e-9],
		['1mg', 0.000001],
		['1g', 0.001],
		['1kg', 1]
	]

	t.plan(inputAndExpected.length)

	inputAndExpected.forEach(([input, expected]) => {
		const result = DosageUnit.fromString(input as string)
		t.is(result.baseScalar, expected as number)
	})
})

ava('toString(): should return a properly formatted dosage value (in the best unit)', t => {
	const inputAndExpected = [
		[1e-9, '1ug'],
		[0.000001, '1mg'],
		[0.001, '1g'],
		[1, '1kg']
	]

	t.plan(inputAndExpected.length)

	inputAndExpected.forEach(([input, expected]) => {
		const dosageUnit = new DosageUnit(input as number)
		const result = dosageUnit.toString()
		t.is(result, expected as string)
	})
})
