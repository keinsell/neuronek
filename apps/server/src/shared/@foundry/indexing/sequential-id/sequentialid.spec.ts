import test                           from 'ava'
import { InvalidValue }               from '~foundry/exceptions/invalid-value.js'
import { SequentialID, sequentialId } from '~foundry/indexing/sequential-id/sequential-id.js'



test('sequentialId should validate and return a SequentialID', (t) => {
	const validID = 123 as SequentialID;
	const invalidID = -12;
	
	t.is(sequentialId(validID), validID);
	t.throws(() => sequentialId(invalidID), { instanceOf: InvalidValue });
});
