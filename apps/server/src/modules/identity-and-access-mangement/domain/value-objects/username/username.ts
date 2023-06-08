import { UsernameIsAboveMinimalCharacterLimit } from './specification/username-is-above-minimal-character-limit.js'
import { UsernameIsBelowMaxiumCharacterLimit } from './specification/username-is-below-maxium-character-limit.js'
import * as t from 'io-ts'
import { InvalidValue } from '~foundry/exceptions/invalid-value.js'

/** Username defines the shape and constraints of a username value object. */
export const Username = new t.Type<string>(
  'Username',
  (input: unknown): input is string => {
    return (
      typeof input === 'string' &&
      new UsernameIsAboveMinimalCharacterLimit().satisfy(input) &&
      new UsernameIsBelowMaxiumCharacterLimit().satisfy(input)
    )
  },
  (input, context) => {
    if (typeof input !== 'string') {
      return t.failure(input, context, 'Username must be a string')
    }

    return t.success(input)
  },
  t.identity
)

export type Username = t.TypeOf<typeof Username>

/** Create new Username value object */
export async function createUsername(username: string): Promise<Username> {
  const validationResult = Username.decode(username)

  let valid: string

  if (validationResult._tag === 'Left') {
    // Handle validation error
    throw new InvalidValue(validationResult.left.join(','))
  } else {
    valid = validationResult.right
  }

  if (
    !new UsernameIsAboveMinimalCharacterLimit().satisfy(valid) ||
    !new UsernameIsBelowMaxiumCharacterLimit().satisfy(valid)
  ) {
    throw new InvalidValue(
      `Username must be between ${UsernameIsAboveMinimalCharacterLimit.MINIMAL_LENGTH} and ${UsernameIsBelowMaxiumCharacterLimit.MAXIMAL_LENGTH} characters long`
    )
  }

  return username as Username
}
