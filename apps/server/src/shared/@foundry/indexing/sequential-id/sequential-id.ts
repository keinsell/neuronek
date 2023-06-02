import * as t             from 'io-ts'
import { InvalidValue }   from '~foundry/exceptions/invalid-value.js'
import { IsSequentialID } from '~foundry/indexing/sequential-id/is-sequentialid.js'



const SequentialIDCodec = t.brand(
	t.number,
	(s: number): s is t.Branded<number, { readonly SequentialID: unique symbol }> => new IsSequentialID().satisfy(s),
	'SequentialID',
)

/**
 * Sequential ID is a unique identifier assigned to data records in a sequential order, typically incrementing by
 * one. It is commonly used in databases and systems where maintaining a consistent order of records is important. Sequential IDs are used to ensure data integrity, enable efficient indexing, and facilitate chronological sorting of records in applications such as transactional systems, logging systems, or content management systems.
 */
export type SequentialID = t.TypeOf<typeof SequentialIDCodec>

/**ś
 * Sequential ID is a unique identifier assigned to data records in a sequential order, typically incrementing by
 * one. It is commonly used in databases and systems where maintaining a consistent order of records is important. Sequential IDs are used to ensure data integrity, enable efficient indexing, and facilitate chronological sorting of records in applications such as transactional systems, logging systems, or content management systems.
 *
 * @param {string} id - The id to validate
 * @returns {SequentialID} - The validated id
 */
export function sequentialId(id?: number): SequentialID {
	const validationResult = SequentialIDCodec.decode(id || 0)
	if (validationResult._tag === 'Left') {
		throw new InvalidValue('Invalid Sequential ID')
	}
	else {
		return validationResult.right
	}
}
