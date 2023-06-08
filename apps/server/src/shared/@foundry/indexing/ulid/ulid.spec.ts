import test             from 'ava'
import { InvalidValue } from '../../exceptions/invalid-value.js'
import { IsUlid }       from './is-ulid.js'
import { ULID, ulid }   from './ulid'



test('ulid() generates a valid ULID', t => {
	const id = ulid()
	t.true(new IsUlid().satisfy(id))
})

test('ulid(id) returns the provided ULID if valid', t => {
	const validULID = '01E6T42T1T65TNBCT6VZ8YHQNX'
	const id = ulid(validULID)
	t.is(id, validULID as ULID)
})

test('ulid() throws InvalidValue error if invalid ULID is generated', t => {
	t.throws(() => ulid('invalid-ulid'), { instanceOf: InvalidValue })
})
