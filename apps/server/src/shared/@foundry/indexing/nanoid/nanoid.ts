import * as t from 'io-ts'
import { nanoid as _nanoid } from 'nanoid'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'
import { IsNanoid } from '~foundry/indexing/nanoid/is-nanoid.js'

const NanoidCodec = t.brand(
	t.string,
	(s: string): s is t.Branded<string, { readonly NanoID: unique symbol }> => new IsNanoid().satisfy(s),
	'NanoID'
)

/**
 * Nanoid is a small, URL-friendly, and cryptographically secure unique ID generator library. It generates compact and random string identifiers that are suitable for various applications, such as generating short IDs for URLs, unique keys for objects, or session IDs. Nanoid is commonly used in web development for generating unique and easily shareable identifiers.
 */
export type NanoID = t.TypeOf<typeof NanoidCodec>

/**
 * Nanoid is a small, URL-friendly, and cryptographically secure unique ID generator library. It generates compact and random string identifiers that are suitable for various applications, such as generating short IDs for URLs, unique keys for objects, or session IDs. Nanoid is commonly used in web development for generating unique and easily shareable identifiers.
 * @param {string} id - The id to validate
 * @param {number} size - The number of characters in the id
 * @returns {NanoID} - The validated id
 */
export function nanoid(id?: string, size: number = 36): NanoID {
	const validationResult = NanoidCodec.decode(id || _nanoid(size))
	if (validationResult._tag === 'Left') {
		throw new InvalidValue('Invalid Nanoid')
	} else {
		return validationResult.right
	}
}
