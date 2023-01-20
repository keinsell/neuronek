import ava from 'ava'
import { DosageUnit } from './dosage-unit.js'

ava('fromString(): should create a dosage unit with baseScalar', t => {
	const inputAndExpected: {
		input: string
		expected: {
			baseScalar: number
			unit: string
		}
	}[] = [
		{ input: '1ug', expected: { baseScalar: 1e-9, unit: 'kg' } },
		{ input: '1mg', expected: { baseScalar: 0.000001, unit: 'kg' } },
		{ input: '1g', expected: { baseScalar: 0.001, unit: 'kg' } },
		{ input: '1kg', expected: { baseScalar: 1, unit: 'kg' } },
		{ input: '1ml', expected: { baseScalar: 0.000001, unit: 'm3' } },
		{ input: '1l', expected: { baseScalar: 0.001, unit: 'm3' } }
	]

	inputAndExpected.forEach(iteration => {
		const result = DosageUnit.fromString(iteration.input)
		t.is(
			result.baseScalar,
			iteration.expected.baseScalar,
			`baseScalar of ${iteration.input} should be ${iteration.expected.baseScalar}`
		)
		t.is(
			result.units(),
			iteration.expected.unit,
			`baseScalar unit of ${iteration.input} should be ${iteration.expected.unit}`
		)
	})
})

ava('toString(): should return a properly formatted dosage value', t => {
	const inputAndExpected: {
		input: {
			value: number
			unit: string
		}
		expected: string
	}[] = [
		{ input: { value: 0.000001, unit: 'kg' }, expected: '1 mg' },
		{ input: { value: 1e-9, unit: 'kg' }, expected: '1 μg' },
		{ input: { value: 0.001, unit: 'kg' }, expected: '1 g' },
		{ input: { value: 1, unit: 'kg' }, expected: '1 kg' },
		{ input: { value: 1, unit: 'l' }, expected: '1 l' }
	]

	inputAndExpected.forEach(({ input, expected }) => {
		const dosageUnit = new DosageUnit(input.value, input.unit)
		const result = dosageUnit.toString()
		t.is(result, expected, `should return ${expected} from provided baseScalar of ${input}`)
	})
})
