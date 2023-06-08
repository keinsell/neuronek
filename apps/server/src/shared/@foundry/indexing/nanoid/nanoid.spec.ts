import test from 'ava'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'
import { NanoID, nanoid } from './nanoid.js'

test('nanoid() generates a valid Nanoid', t => {
	const id = nanoid()
	t.true(isValidNanoid(id))
})

test('nanoid(id) returns the provided Nanoid if valid', t => {
	const validNanoid = 'UMmgcRhFekXDAmrtUJYFc'
	const id = nanoid(validNanoid)
	t.is(id, validNanoid as NanoID)
})

test('nanoid() throws InvalidValue error if invalid Nanoid is generated', t => {
	t.throws(() => nanoid('xyz'), { instanceOf: InvalidValue })
})

function isValidNanoid(id: string): boolean {
	const nanoidRegex = new RegExp(`^[a-zA-Z0-9_-]{8,64}$`)
	return nanoidRegex.test(id)
}
