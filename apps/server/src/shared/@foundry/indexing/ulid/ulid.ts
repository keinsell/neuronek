import * as t from 'io-ts'
import _ulid from 'ulid'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'
import { IsUlid } from '~foundry/indexing/ulid/is-ulid.js'



interface ULIDBrand {
  readonly ULID: unique symbol
}

const UlidCodec = t.brand(t.string, (s: string): s is t.Branded<string, ULIDBrand> => new IsUlid().satisfy(s), 'ULID')

/**
 * Universally Unique Lexicographically Sortable Identifier (ULID) is a string identifier that combines randomness and time-based ordering. It is typically used in distributed systems and databases to generate unique identifiers that can be sorted in chronological order. ULIDs are compact, URL-safe, and suitable for applications that require uniqueness, sorting, and a human-readable format for IDs.
 */
export type ULID = t.TypeOf<typeof UlidCodec>

export function ulid(id?: string): ULID {
  const validationResult = UlidCodec.decode(id || _ulid.ulid())
  if (validationResult._tag === 'Left') {
    throw new InvalidValue('Invalid ULID')
  } else {
    return validationResult.right
  }
}
