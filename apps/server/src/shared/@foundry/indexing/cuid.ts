import generateCuid     from 'cuid'
import * as t           from 'io-ts'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'



interface CUIDBrand {
	readonly CUID: unique symbol
}

/**
 * Determines if input is a valid CUID
 *
 * @param input
 */
function isCuid(input: string): boolean {
	return generateCuid.isCuid(input)
}

const CUIDCodec = t.brand(t.string, (s): s is t.Branded<string, CUIDBrand> => isCuid(s), 'CUID')

export type CUID = t.TypeOf<typeof CUIDCodec>

/**
 * Creates a new CUID
 *
 * @param id - Optional CUID
 */
export function cuid(id?: string): CUID {
	const validationResult = CUIDCodec.decode(id || generateCuid())
	if (validationResult._tag === 'Left') {
		throw new InvalidValue('Invalid CUID')
	} else {
		return validationResult.right
	}
}
