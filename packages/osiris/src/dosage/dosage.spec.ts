import ava, { TestFn } from 'ava'
import { Dosage } from './dosage.js'

const test = ava as TestFn<{
	baseScalarAndString: {
		baseScalar: number
		unit: string
		string: string
	}[]
}>

test.beforeEach(t => {
	t.context.baseScalarAndString = [
		{ baseScalar: 1e-9, unit: 'kg', string: '1 μg' },
		{ baseScalar: 0.000001, unit: 'kg', string: '1 mg' },
		{ baseScalar: 0.001, unit: 'kg', string: '1 g' },
		{ baseScalar: 1, unit: 'kg', string: '1 kg' },
		{ baseScalar: 0.000001, unit: 'm3', string: '1 cm3' },
		{ baseScalar: 0.001, unit: 'm3', string: '1000 cm3' }
	]
})

test('fromString(): should create a dosage unit with baseScalar', t => {
	t.context.baseScalarAndString.forEach(iteration => {
		const result = Dosage.fromString(iteration.string)
		t.is(result.baseScalar, iteration.baseScalar, `baseScalar of ${iteration.string} should be ${iteration.baseScalar}`)
		t.is(result.units(), iteration.unit, `baseScalar unit of ${iteration.string} should be ${iteration.unit}`)
	})
})

test('toString(): should return a properly formatted dosage value', t => {
	t.context.baseScalarAndString.forEach(({ string, unit, baseScalar }) => {
		const dosage = new Dosage(baseScalar, unit)
		const result = dosage.toString()
		t.is(result, string, `should return ${string} from provided baseScalar of ${baseScalar}`)
	})
})
